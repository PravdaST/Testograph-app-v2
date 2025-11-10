-- Fix profile picture URLs with double profile-pictures path
UPDATE quiz_results_v2
SET profile_picture_url = NULL
WHERE email = 'valeriinterselar@gmail.com'
  AND profile_picture_url LIKE '%profile-pictures/profile-pictures/%';

-- Show result
SELECT email, profile_picture_url 
FROM quiz_results_v2 
WHERE email = 'valeriinterselar@gmail.com';
