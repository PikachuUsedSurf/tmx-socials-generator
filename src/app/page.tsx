const GITHUB_REPO = "PikachuUsedSurf/tmx-socials-generator"
const COMMITS_URL = `https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=20`
const COMMITS_PAGE_URL = `https://github.com/${GITHUB_REPO}/commits`

interface GitHubCommit {
  sha: string
  html_url: string
  commit: {
    message: string
    author: {
      name: string
      date: string
    }
  }
}

async function getCommits(): Promise<GitHubCommit[]> {
  try {
    const res = await fetch(COMMITS_URL, {
      next: { revalidate: 300 }, // revalidate every 5 minutes
      headers: { Accept: "application/vnd.github+json" },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function Home() {
  const commits = await getCommits()

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-24 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Welcome to TMX Content Generator
      </h1>
      <p className="text-center text-base sm:text-lg mb-8 text-muted-foreground line-through">
        copy pasta&apos;s function are in the social poster generator page.
      </p>
      <p className="text-center text-base sm:text-lg mb-8 text-muted-foreground line-through">
        copy pasta&apos;s got power crept once again lol.
      </p>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold">Commit History</h2>
          <a
            href={COMMITS_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            View all on GitHub →
          </a>
        </div>

        {commits.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
            Could not load commits from GitHub. Check your connection or{" "}
            <a href={COMMITS_PAGE_URL} target="_blank" rel="noopener noreferrer" className="underline">
              view them directly on GitHub
            </a>
            .
          </div>
        ) : (
          <div className="space-y-4">
            {commits.map((commit, i) => {
              const shortSha = commit.sha.slice(0, 7)
              const date = new Date(commit.commit.author.date).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
              // Only show first line of commit message as title; rest as body
              const [title, ...bodyLines] = commit.commit.message.split("\n")
              const body = bodyLines.join("\n").trim()

              return (
                <div key={commit.sha} className="bg-white rounded-lg shadow-sm border p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-blue-600 leading-snug">
                      {i + 1}. {title}
                    </h3>
                    <a
                      href={commit.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 font-mono text-xs text-gray-400 hover:text-blue-500 hover:underline mt-0.5"
                    >
                      {shortSha}
                    </a>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {commit.commit.author.name} · {date}
                  </p>
                  {body && (
                    <pre className="mt-2 text-sm text-gray-600 whitespace-pre-wrap font-sans">{body}</pre>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
