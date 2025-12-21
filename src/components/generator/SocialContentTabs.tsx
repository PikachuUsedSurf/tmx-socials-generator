"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContentDisplay } from "@/components/social-media/ContentDisplay"
import { toast } from "@/hooks/use-toast"

interface SocialContentTabsProps {
    youtube: string
    facebook: string
    instagram: string
}

export function SocialContentTabs({
    youtube,
    facebook,
    instagram,
}: SocialContentTabsProps) {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast({
            title: "Copied to clipboard",
            description: "The generated content has been copied to your clipboard.",
        })
    }

    return (
        <Tabs defaultValue="youtube" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="youtube">YouTube</TabsTrigger>
                <TabsTrigger value="facebook">Facebook</TabsTrigger>
                <TabsTrigger value="instagram">Instagram</TabsTrigger>
            </TabsList>

            <TabsContent value="youtube" className="mt-4">
                <ContentDisplay
                    label="YouTube Title"
                    content={youtube}
                    onCopy={() => copyToClipboard(youtube)}
                    showCharCount
                    charLimit={100}
                />
            </TabsContent>

            <TabsContent value="facebook" className="mt-4">
                <ContentDisplay
                    label="Facebook Post"
                    content={facebook}
                    onCopy={() => copyToClipboard(facebook)}
                />
            </TabsContent>

            <TabsContent value="instagram" className="mt-4">
                <ContentDisplay
                    label="Instagram Post"
                    content={instagram}
                    onCopy={() => copyToClipboard(instagram)}
                />
            </TabsContent>
        </Tabs>
    )
}
