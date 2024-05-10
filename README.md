# Chrome Extension Template With React And Node.js Backend

- author: https://github.com/HyperGrapher

this is a very bare bone template for quick bootstraping chrome extension projects. 
<br/>
Uses separate node_modules for client and server for now, later might be a monorepo.

### Techs
- React.js (typescript)
- Node.js / Express.js
- MySQL database
- Tailwind CSS
- Zustand state manager
- Manifest V3

### Properties
- User registration with email
- Login/Logout
- JWT authorization


### Before installing and running
- rename ".env.example" file/files to ".env"
- fill in "null" values in .env's
- run `npm install` command in both client and server folders
- to build the extension run `npm run build` command in client folder *
- run `npm run dev` command in both folders
- open 'extensions' window in chrome
- click `Load unpacked` and select `dist` folder in client folder *


### Minimal "users" table MySQL structure

```sql

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);


--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;

```