import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import { useAuthStore } from "@/src/stores/auth.store";
import { ArtPieceWithPhotos, ArtPiece, ArtPhoto } from "@/src/types/database.types";
import { STORAGE_BUCKET } from "@/src/lib/constants";
import { uriToArrayBuffer } from "@/src/utils/image";
import { buildStoragePath, getPublicUrl } from "@/src/utils/storage";

export function useArtPiece(id: string) {
  return useQuery({
    queryKey: ["art-piece", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("art_pieces")
        .select(
          `
          *,
          art_photos (*)
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as ArtPieceWithPhotos;
    },
    enabled: !!id,
  });
}

interface CreateArtPieceInput {
  portfolioId: string;
  title?: string;
  artist?: string;
  year?: string;
  medium?: string;
  dimensions?: string;
  notes?: string;
  venueName?: string;
  venueCity?: string;
  visitDate?: string;
  artworkPhotos: { uri: string; width: number; height: number }[];
  labelPhoto?: { uri: string; width: number; height: number } | null;
}

export function useCreateArtPiece() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (input: CreateArtPieceInput) => {
      const ownerId = user!.id;

      // 1. Create the art piece row
      const { data: artPiece, error: artError } = await supabase
        .from("art_pieces")
        .insert({
          portfolio_id: input.portfolioId,
          owner_id: ownerId,
          title: input.title || null,
          artist: input.artist || null,
          year: input.year || null,
          medium: input.medium || null,
          dimensions: input.dimensions || null,
          notes: input.notes || null,
          venue_name: input.venueName || null,
          venue_city: input.venueCity || null,
          visit_date: input.visitDate || null,
        })
        .select()
        .single();

      if (artError) throw artError;

      // 2. Upload artwork photos
      const photoRows: Omit<ArtPhoto, "id" | "created_at" | "blurhash" | "auto_crop_rect">[] = [];

      for (let i = 0; i < input.artworkPhotos.length; i++) {
        const photo = input.artworkPhotos[i];
        const fileName = `artwork_${i}_${Date.now()}.jpg`;
        const storagePath = buildStoragePath(
          ownerId,
          input.portfolioId,
          artPiece.id,
          fileName
        );

        const arrayBuffer = await uriToArrayBuffer(photo.uri);
        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(storagePath, arrayBuffer, {
            contentType: "image/jpeg",
          });

        if (uploadError) throw uploadError;

        photoRows.push({
          art_piece_id: artPiece.id,
          owner_id: ownerId,
          storage_path: storagePath,
          public_url: getPublicUrl(storagePath),
          photo_type: "artwork",
          sort_order: i,
          width_px: photo.width,
          height_px: photo.height,
        });
      }

      // 3. Upload label photo if present
      if (input.labelPhoto) {
        const fileName = `label_${Date.now()}.jpg`;
        const storagePath = buildStoragePath(
          ownerId,
          input.portfolioId,
          artPiece.id,
          fileName
        );

        const arrayBuffer = await uriToArrayBuffer(input.labelPhoto.uri);
        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(storagePath, arrayBuffer, {
            contentType: "image/jpeg",
          });

        if (uploadError) throw uploadError;

        photoRows.push({
          art_piece_id: artPiece.id,
          owner_id: ownerId,
          storage_path: storagePath,
          public_url: getPublicUrl(storagePath),
          photo_type: "label",
          sort_order: input.artworkPhotos.length,
          width_px: input.labelPhoto.width,
          height_px: input.labelPhoto.height,
        });
      }

      // 4. Insert photo rows
      if (photoRows.length > 0) {
        const { error: photosError } = await supabase
          .from("art_photos")
          .insert(photoRows);

        if (photosError) throw photosError;
      }

      return artPiece as ArtPiece;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["portfolio-art-pieces", data.portfolio_id],
      });
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
    },
  });
}

export function useDeleteArtPiece() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      portfolioId,
    }: {
      id: string;
      portfolioId: string;
    }) => {
      const { error } = await supabase
        .from("art_pieces")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { portfolioId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["portfolio-art-pieces", data.portfolioId],
      });
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
    },
  });
}
