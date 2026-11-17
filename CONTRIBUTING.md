# Working together

## Rules that prevent merge pain
1. **Never work directly on `main`.** Make a branch: `git checkout -b siddhi/short-name` (or `krishan/short-name`).
2. **Pull before you start and before you push:** `git pull --rebase origin main`.
3. **Small commits, small PRs.** Push at least every 30-45 minutes so the other person can see your work.
4. **One owner per file area** (below). If you need to change the other person's area, message them first.
5. **Never commit secrets.** `.env` files are git-ignored. API keys go only in Render/Vercel dashboards.
6. CI must be green (backend tests + frontend build) before merging a PR.

## Daily commands
```bash
git checkout main && git pull --rebase origin main     # start of session
git checkout -b yourname/what-you-do                   # new branch
git add -A && git commit -m "Short clear message"      # save work
git pull --rebase origin main                          # bring in the other person's changes
git push -u origin yourname/what-you-do                # first push of the branch (later: git push)
# then open a Pull Request on GitHub, get a quick look from the other person, "Squash and merge"
```
If a rebase shows conflicts: open the files, keep both sides' intent, `git add <file>`, `git rebase --continue`.
Stuck? `git rebase --abort` returns you to before the pull. Ask in chat before using `--force`.

## Ownership (edit this to match your split)
| Area | Owner |
|---|---|
| `backend/app/data/schemes.json`, `backend/app/engine.py`, backend tests | Person A |
| `frontend/` (pages, components, styling) | Person B |
| `README.md`, `render.yaml`, deploy settings | Person A (Render) / Person B (Vercel) |

## 5-hour plan
| Time | Person A (backend + data) | Person B (frontend) |
|---|---|---|
| 0:00-0:30 | Push repo, add collaborator, both clone and run locally | same |
| 0:30-2:30 | Verify the 6 schemes against official pages, fill links, grow to 12-15 schemes, add tests per scheme | Set `VITE_USE_MOCK=false`, test chat + results against the local backend, loading and error states, mobile layout |
| 2:30-3:30 | Deploy backend on Render, set env vars, check `/health` and `/docs` | Deploy frontend on Vercel, set `VITE_API_BASE`, fix CORS with A |
| 3:30-4:30 | Test 10 fixed profiles end to end (include the Ramesh example) | Hindi text check on the live site, phone test |
| 4:30-5:00 | README, project description | Backup demo video, final screenshots, submit |

## Definition of done for a scheme record
- eligibility, documents and how-to-apply match the official page
- `official_url` filled, `last_checked` set, `verified: true`
- a test in `backend/tests/` for one eligible and one not-eligible profile
