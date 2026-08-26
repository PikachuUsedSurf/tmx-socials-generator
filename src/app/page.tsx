import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  ExternalLink,
  Image,
  Table2,
  MapPin,
  LayoutDashboard,
  Type,
  GitCommitHorizontal,
} from "lucide-react";
import Link from "next/link";
import packageJson from "../../package.json";

const GITHUB_REPO = "PikachuUsedSurf/tmx-socials-generator"
const COMMITS_URL = `https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=5`
const COMMITS_PAGE_URL = `https://github.com/${GITHUB_REPO}/commits`

const APP_VERSION = packageJson.version

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

const TOOLS = [
  {
    title: "Social Media Poster",
    description: "Generate branded auction posters for crops and locations.",
    href: "/social-media-poster",
    icon: Image,
  },
  {
    title: "Content Generator",
    description: "YouTube, Facebook and Instagram copy-paste captions.",
    href: "/social-media-generator",
    icon: Type,
  },
  {
    title: "Commodity Prices",
    description: "Price tables for TMX auction commodities.",
    href: "/commodity-price",
    icon: Table2,
  },
  {
    title: "Region Codes",
    description: "Look up TMX region codes.",
    href: "/region-code",
    icon: MapPin,
  },
  {
    title: "Dashboard",
    description: "Overview of the generator toolset.",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
]

function formatDate(date: string): string {
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function Home() {
  const commits = await getCommits()
  const latest = commits[0]

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-24 py-10">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          TMX Content Generator
        </h1>
        <p className="text-base sm:text-lg mb-4 text-muted-foreground">
          Posters, copy pasta and price tables for TMX auctions.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="font-mono text-xs">
            v{APP_VERSION}
          </Badge>
          {latest && (
            <a
              href={latest.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
              title={latest.commit.message}
            >
              <GitCommitHorizontal className="size-3.5" />
              {latest.sha.slice(0, 7)}
            </a>
          )}
        </div>
      </div>

      {/* Quick launch */}
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Tools</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        {TOOLS.map((tool) => (
          <Link key={tool.href} href={tool.href} className="group">
            <Card className="h-full transition-colors group-hover:border-foreground/20 group-hover:bg-accent/40">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <tool.icon className="size-4 text-muted-foreground" />
                  {tool.title}
                  <ExternalLink className="size-3 ml-auto opacity-0 transition-opacity group-hover:opacity-60" />
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground pt-0">
                {tool.description}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* What's new */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold">What&apos;s new</h2>
        <a
          href={COMMITS_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
        >
          Full history on GitHub
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
        <div className="max-w-4xl mx-0 flex flex-col divide-y divide-border rounded-lg border">
          {commits.map((commit) => {
            const shortSha = commit.sha.slice(0, 7)
            const [title] = commit.commit.message.split("\n")
            return (
              <div key={commit.sha} className="px-4 py-3 flex items-start justify-between gap-3 text-sm">
                <span className="font-medium leading-snug">{title}</span>
                <span className="shrink-0 flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                  <span>{formatDate(commit.commit.author.date)}</span>
                  <Separator orientation="vertical" className="h-3.5" />
                  <a
                    href={commit.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono hover:text-foreground hover:underline"
                  >
                    {shortSha}
                  </a>
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
