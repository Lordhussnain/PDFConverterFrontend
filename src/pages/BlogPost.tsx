import { format } from "date-fns";
import { Lightbulb } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const defaultPost = {
  title: "Designing websites faster with shadcn/ui",
  authorName: "John Doe",
  image:
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
  pubDate: new Date(),
  description:
    "A step-by-step guide to building a modern, responsive blog using React and Tailwind CSS.",
  authorImage:
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
};

interface BlogPostData {
  title: string;
  authorName: string;
  image: string;
  pubDate: Date;
  description: string;
  authorImage: string;
}

export function Blogpost1({ post = defaultPost }: { post?: BlogPostData }) {
  const { title, authorName, image, pubDate, description, authorImage } = post;

  return (
    <>
      {/* Optional Page Header (breadcrumb/branding area) */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <h1 className="text-lg font-semibold text-foreground">Our Blog</h1>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <span className="text-sm text-muted-foreground">
          Read design & development stories
        </span>
      </header>

      {/* Main Blog Layout */}
      <section className="py-12">
        <div className="container grid gap-10 lg:grid-cols-[1fr_320px]">
          {/* MAIN ARTICLE CONTENT */}
          <main className="max-w-3xl mx-auto">
            <div className="flex flex-col items-center text-center gap-4 mb-10">
              <h1 className="text-pretty text-5xl font-semibold md:text-6xl">
                {title}
              </h1>
              <h3 className="text-muted-foreground text-lg md:text-xl max-w-3xl">
                {description}
              </h3>
              <div className="flex items-center gap-3 text-sm md:text-base">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={authorImage} />
                  <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>
                  <a href="#" className="font-semibold">
                    {authorName}
                  </a>
                  <span className="ml-1">
                    on {format(pubDate, "MMMM d, yyyy")}
                  </span>
                </span>
              </div>
              <img
                src={image}
                alt="placeholder"
                className="mb-8 mt-4 aspect-video w-full rounded-lg border object-cover"
              />
            </div>

            {/* Blog Body */}
            <div className="prose dark:prose-invert mx-auto">
              <h2>The Great Joke Tax</h2>
              <p>
                In a kingdom far away, where laughter once flowed freely, a
                peculiar tale unfolded about a king who decided to tax the
                very essence of joy itself—jokes and jest.
              </p>

              <h2>How the Tax System Works</h2>
              <p>
                The king, seeing how much happier his subjects were, realized
                the error of his ways and repealed the joke tax. Jokester was
                declared a hero, and the kingdom lived happily ever after.
              </p>

              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Royal Decree!</AlertTitle>
                <AlertDescription>
                  Remember, all jokes must be registered at the Royal Jest
                  Office before telling them.
                </AlertDescription>
              </Alert>

              <h2>The People's Rebellion</h2>
              <p>
                The people of the kingdom, feeling uplifted by the laughter,
                started to tell jokes and puns again, and soon the entire
                kingdom was in on the joke.
              </p>

              <table>
                <thead>
                  <tr>
                    <th>King's Treasury</th>
                    <th>People's Happiness</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Empty</td>
                    <td>Overflowing</td>
                  </tr>
                  <tr className="even:bg-muted">
                    <td>Modest</td>
                    <td>Satisfied</td>
                  </tr>
                  <tr className="even:bg-muted">
                    <td>Full</td>
                    <td>Ecstatic</td>
                  </tr>
                </tbody>
              </table>

              <h2>The King's Plan</h2>
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
                alt="placeholder"
                className="my-8 aspect-video w-full rounded-md object-cover"
              />
              <blockquote>
                “Everyone enjoys a good joke, so it’s only fair they pay for
                the privilege.”
              </blockquote>
              <p>
                As a result, people stopped telling jokes, and the kingdom fell
                into gloom. But one court jester refused to be silenced.
              </p>
            </div>
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="flex flex-col gap-6 relative z-10 lg:sticky lg:top-24 self-start">
            <div className="flex flex-col gap-6 w-full">

              {/* Related Posts */}
              <Card className="shadow-sm border bg-background/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Related Posts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <a href="#" className="block hover:underline">
                    Building dashboards with shadcn/ui
                  </a>
                  <a href="#" className="block hover:underline">
                    Tailwind tips for design workflows
                  </a>
                  <a href="#" className="block hover:underline">
                    Understanding Radix Primitives
                  </a>
                </CardContent>
              </Card>

              {/* About the Author */}
              <Card className="shadow-sm border bg-background/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>About the Author</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={authorImage} />
                      <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{authorName}</p>
                      <p className="text-sm text-muted-foreground">Frontend Engineer</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Writes about design systems, UI frameworks, and modern web
                    architecture.
                  </p>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card className="shadow-sm border bg-background/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Join Newsletter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get weekly design & development stories.
                  </p>
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full rounded-md border p-2 text-sm mb-2 bg-background"
                  />
                  <button className="w-full bg-primary text-white text-sm py-2 rounded-md">
                    Subscribe
                  </button>
                </CardContent>
              </Card>

              <Separator />
              <p className="text-xs text-muted-foreground text-center">
                © 2025 Your Blog
              </p>
            </div>
          </aside>

        </div>
      </section>
    </>
  );
}