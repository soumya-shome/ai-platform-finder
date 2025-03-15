
// Re-export from individual service files for a cleaner interface
export { 
  getPlatforms,
  getPlatformById,
  getPlatformsByTag,
  getAllTags,
  addNewPlatform,
  searchPlatformsDatabase
} from './platformService';

export {
  getReviewsByPlatformId,
  addReview,
  flagReview
} from './reviewService';

export {
  migrateDataToSupabase
} from './migrationService';

export {
  getFlaggedReviews,
  approveReview,
  rejectReview
} from './adminService';
