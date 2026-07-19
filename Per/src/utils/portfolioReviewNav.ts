import { PORTFOLIO_REVIEWS_URL, reviewAnchorId } from '../data/content-extended';

export const PORTFOLIO_REVIEWS_SECTION_ID = 'client-reviews';

export interface PortfolioReviewNavState {
  focusReview?: string;
}

export function getPortfolioReviewLink(name: string) {
  const reviewId = reviewAnchorId(name);

  return {
    pathname: '/portfolio',
    hash: `#${reviewId}`,
    state: { focusReview: reviewId } satisfies PortfolioReviewNavState,
  };
}

export function resolvePortfolioReviewScrollTarget(
  hash: string,
  state: PortfolioReviewNavState | null,
): string {
  if (state?.focusReview?.startsWith('review-')) {
    return state.focusReview;
  }

  const hashId = hash.replace('#', '');
  if (hashId.startsWith('review-')) {
    return hashId;
  }

  return PORTFOLIO_REVIEWS_SECTION_ID;
}

export { PORTFOLIO_REVIEWS_URL };
