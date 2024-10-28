-- AlterTable
CREATE SEQUENCE category_id_seq;
ALTER TABLE "Category" ALTER COLUMN "id" SET DEFAULT nextval('category_id_seq');
ALTER SEQUENCE category_id_seq OWNED BY "Category"."id";

-- AlterTable
CREATE SEQUENCE global_setting_id_seq;
ALTER TABLE "Global_Setting" ALTER COLUMN "id" SET DEFAULT nextval('global_setting_id_seq');
ALTER SEQUENCE global_setting_id_seq OWNED BY "Global_Setting"."id";

-- AlterTable
CREATE SEQUENCE user_setting_id_seq;
ALTER TABLE "User_Setting" ALTER COLUMN "id" SET DEFAULT nextval('user_setting_id_seq');
ALTER SEQUENCE user_setting_id_seq OWNED BY "User_Setting"."id";
