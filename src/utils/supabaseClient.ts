
// Re-export from individual service files
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
