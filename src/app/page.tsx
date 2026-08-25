import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, ExternalLink } from "lucide-react";

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
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
        Welcome to TMX Content Generator
      </h1>
      <p className="text-center text-base sm:text-lg mb-8 text-muted-foreground">
        Posters, copy pasta and price tables for TMX auctions.
      </p>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold">Commit History</h2>
          <a
            href={COMMITS_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
          >
            View all on GitHub
            <ExternalLink className="size-4" />
          </a>
        </div>

        {commits.length === 0 ? (
          <Alert>
            <AlertCircle className="size-4" />
            <AlertTitle>Could not load commits from GitHub</AlertTitle>
            <AlertDescription>
              Check your connection or{" "}
              <a
                href={COMMITS_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                view them directly on GitHub
              </a>
              .
            </AlertDescription>
          </Alert>
        ) : (
          <div className="flex flex-col gap-4">
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
                <Card key={commit.sha}>
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold leading-snug">
                        <Badge variant="secondary" className="mr-2 font-mono">
                          #{i + 1}
                        </Badge>
                        {title}
                      </h3>
                      <a
                        href={commit.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 font-mono text-xs text-muted-foreground hover:text-foreground hover:underline mt-0.5"
                      >
                        {shortSha}
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {commit.commit.author.name} · {date}
                    </p>
                    {body && (
                      <>
                        <Separator className="my-2" />
                        <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">{body}</pre>
                      </>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
