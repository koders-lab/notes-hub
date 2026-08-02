import { i18n } from "../../i18n"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const NotFound: QuartzComponent = ({ cfg, ctx }: QuartzComponentProps) => {
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = ctx.argv.serve ? "/" : url.pathname

  return (
    <article class="popover-hint" style="text-align: center; margin-top: 3rem;">
      <img 
        src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTNrODhpcm01cHZwdHplcGJ4anB5aXF1aW01a2NhNDYwcXM1NnB3aiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/JsE9qckiYyVClQ5bY2/giphy.gif" 
        alt="Coming Soon GIF" 
        width="320" 
        style="border-radius: 8px; margin-bottom: 1.5rem;" 
      />
      <h1>404 - Coming Soon</h1>
      <p style="font-size: 1.1rem; margin-bottom: 1.5rem;">
        This page hasn't been added in notes hub yet. Care to contribute by raising a PR ?
      </p>
      <a href={baseDir} style="display: inline-block; padding: 0.6rem 1.2rem; background: var(--secondary); color: white; border-radius: 6px; text-decoration: none; font-weight: 500;">
        {i18n(cfg.locale).pages.error.home}
      </a>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          if (typeof fetchData !== "undefined") {
            fetchData.then(function(index) {
              var basePath = document.body.dataset.basepath || "";
              if (basePath.length > 1 && basePath.endsWith("/")) {
                basePath = basePath.slice(0, -1);
              }
              var pathname = window.location.pathname;
              var hasBasePrefix = basePath.length > 1 && pathname.startsWith(basePath);
              if (hasBasePrefix) {
                pathname = pathname.slice(basePath.length);
              }
              if (pathname.startsWith("/")) {
                pathname = pathname.slice(1);
              }
              if (pathname.endsWith("/")) {
                pathname = pathname.slice(0, -1);
              }
              if (pathname.endsWith(".html")) {
                pathname = pathname.slice(0, -5);
              }
              if (pathname.endsWith("/index")) {
                pathname = pathname.slice(0, -6);
              }
              var lowered = pathname.toLowerCase();
              if (lowered !== pathname && index[lowered] != null) {
                var prefix = hasBasePrefix ? basePath : "";
                var target = prefix + (prefix.endsWith("/") ? "" : "/") + lowered;
                window.location.replace(target);
              }
            });
          }
          `,
        }}
      />
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor