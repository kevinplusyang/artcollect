import { WEB_BASE_URL } from "@/src/lib/constants";

export function getPortfolioShareUrl(shareToken: string): string {
  return `${WEB_BASE_URL}/share/p/${shareToken}`;
}

export function getArtPieceShareUrl(shareToken: string): string {
  return `${WEB_BASE_URL}/share/a/${shareToken}`;
}
