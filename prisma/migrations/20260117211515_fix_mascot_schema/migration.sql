-- Step 1: Rename image column to imageUrl
ALTER TABLE "mascot" RENAME COLUMN "image" TO "imageUrl";

-- Step 2: Add new columns with temporary defaults
ALTER TABLE "mascot" 
ADD COLUMN "type" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN "basePersonality" TEXT NOT NULL DEFAULT 'Friendly',
ADD COLUMN "baseGreeting" TEXT NOT NULL DEFAULT 'Hello!',
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Step 3: Update existing mascots with proper values based on their names
UPDATE "mascot" 
SET 
  "type" = 'Cat',
  "basePersonality" = 'Curious',
  "baseGreeting" = 'Xin chào! Mình là Curious Cat!'
WHERE "id" = 'curious_cat';

UPDATE "mascot" 
SET 
  "type" = 'Bear',
  "basePersonality" = 'Brave',
  "baseGreeting" = 'Chào bạn! Mình là Brave Bear!'
WHERE "id" = 'brave_bear';

UPDATE "mascot" 
SET 
  "type" = 'Owl',
  "basePersonality" = 'Wise',
  "baseGreeting" = 'Chào em! Mình là Smart Owl!'
WHERE "id" = 'smart_owl';

UPDATE "mascot" 
SET 
  "type" = 'Space Cat',
  "basePersonality" = 'Adventurous',
  "baseGreeting" = 'Chào các phi hành gia! Mình là Captain Whisker!'
WHERE "id" = 'cat_explorer';

-- Step 4: Remove defaults (for future inserts to require explicit values)
ALTER TABLE "mascot" 
ALTER COLUMN "type" DROP DEFAULT,
ALTER COLUMN "basePersonality" DROP DEFAULT,
ALTER COLUMN "baseGreeting" DROP DEFAULT;
