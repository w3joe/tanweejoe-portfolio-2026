# PostHog post-wizard report

The wizard has completed a deep integration of your portfolio. PostHog was already partially integrated with 8 events and a properly initialised snippet using the `window.__posthog_initialized` guard for Astro View Transitions. The wizard extended this with 3 additional events (`blog_card_clicked`, `view_all_works_clicked`, `view_all_posts_clicked`), confirmed the correct environment variable values in `.env`, installed `posthog-js` for TypeScript types, and built a PostHog dashboard with 5 insights to monitor user behaviour.

| Event | Description | File |
|---|---|---|
| `hero_cta_clicked` | User clicks the primary CTA button in the hero section | `src/components/home-hero.astro` |
| `view_all_works_clicked` | User clicks "View all" in the Works section on the home page | `src/pages/index.astro` |
| `project_link_clicked` | User clicks a project card to visit the project link | `src/components/project-card.astro` |
| `view_all_posts_clicked` | User clicks "See all posts" on the home page | `src/pages/index.astro` |
| `blog_card_clicked` | User clicks a blog card from a listing page | `src/components/blog-card.astro` |
| `blog_post_viewed` | User views an individual blog post | `src/pages/blog/[...id].astro` |
| `tag_clicked` | User clicks a tag on a blog post | `src/pages/blog/[...id].astro` |
| `post_navigation_clicked` | User clicks previous/next post navigation | `src/components/post-navigation.astro` |
| `social_link_clicked` | User clicks a social icon link | `src/components/social-icons.astro` |
| `contact_link_clicked` | User clicks a contact link (LinkedIn or email) | `src/pages/about.astro` |
| `theme_toggled` | User toggles the light/dark theme | `src/components/theme-toggle.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics:** https://us.posthog.com/project/369602/dashboard/1483043
- **Blog discovery funnel** (blog_card_clicked → blog_post_viewed): https://us.posthog.com/project/369602/insights/LEG7n7nI
- **Top projects clicked** (by project name): https://us.posthog.com/project/369602/insights/b0bIp6so
- **Contact link clicks** (by channel): https://us.posthog.com/project/369602/insights/PO2nY0eE
- **Social link engagement** (by platform): https://us.posthog.com/project/369602/insights/diMF6Nya
- **Hero CTA clicks over time:** https://us.posthog.com/project/369602/insights/ukFM2jHN

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
