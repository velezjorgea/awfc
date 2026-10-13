# Alconbury Weald FC Fines Book (Netlify version)

Weekly fines sheet, dashboards and Excel season report.
Everyone can view it. Only someone with the admin password can add fines.

## What's in this folder

| Path | What it does |
|---|---|
| `public/index.html` | The website (sheet, dashboards, Excel download) |
| `netlify/functions/login.mjs` | Checks the admin password on Netlify's server |
| `netlify/functions/fines.mjs` | Loads and saves the fines (stored in Netlify Blobs) |
| `netlify/lib/auth.mjs` | Shared login code |
| `netlify.toml`, `package.json` | Netlify settings |

## Set it up (about 10 minutes)

1. **Put the files on GitHub.** Create a new repository (for example `awfc-fines`). Upload everything from this folder, keeping the folder structure. The easiest way is to drag the files into GitHub's "Add file → Upload files" page.
2. **Connect it to Netlify.** In Netlify choose **Add new project → Import an existing project → GitHub**, then pick the repository. Leave the build settings as Netlify suggests; `netlify.toml` already says where everything is.
3. **Set the admin password.** Go to **Site configuration → Environment variables → Add a variable**:
   - Key: `ADMIN_PASSWORD`
   - Value: your password (pick a strong one)
4. **Deploy again** so the password takes effect: **Deploys → Trigger deploy → Deploy site**.
5. **Rename the site** (optional): **Site configuration → Change site name**, for example `awfc-fines` → `awfc-fines.netlify.app`.

Use GitHub (or the Netlify CLI: `netlify deploy --prod`) rather than drag-and-drop. Saving relies on Netlify Functions and the `@netlify/blobs` package, and GitHub deploys reliably install and build both.

## Using it

- **Players:** just open the link. No login.
- **Admin:** tap **Admin login**, enter the password, add fines, press **Save for everyone**. You stay logged in on that device for 12 hours. Tap **Log out** on a shared phone.
- If two admins save at the same time, the second one is told and asked to load the latest sheet first. Nothing gets silently overwritten.

## Changing things later

- **Password:** edit `ADMIN_PASSWORD` in Netlify and redeploy. Everyone who was logged in is logged out.
- **Squad, fine amounts, season dates:** change them in the app under **Squad & tariff** while logged in as admin.
- **First load:** until the first save, the site shows the 26-player squad and the club fine list built into the page. After the first save, everything comes from Netlify's storage.

## Optional extra setting

`TOKEN_SECRET`: any long random text. Adding it makes admin logins harder to forge. Changing it logs everyone out.
