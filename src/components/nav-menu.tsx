"use client"

import * as React from "react"
import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Job Description",
    href: "/job-description",
    description:
      "Job description page.",
  },
  {
    title: "Job parse",
    href: "/job-parse",
    description:
      "Job parse page.",
  },
]

export default function NavigationMenuDemo() {
  return (
    <NavigationMenu className="mx-auto my-5">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Páginas</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-96">
              <ListItem href="/" title="Home">
                Home page
              </ListItem>
              <ListItem href="/components" title="Components">
                Components page
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Jobs</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-96">
              <ListItem href="/job-description" title="Job Description">
                Job description page.
              </ListItem>
              <ListItem href="/job-parse" title="Job parse">
                Job parse page.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Ats</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-96">
              <ListItem href="/match-ats" title="Match Ats">
                Match ats page.
              </ListItem>
              <ListItem href="/optimizing-resume" title="Optimizing Resume">
                Optimizing resume page.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Content</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-96">
              <ListItem href="/full-content-en-us" title="Full Content En Us">
                Full content en us page.
              </ListItem>
              <ListItem href="/content-en-us" title="Content En Us">
                Content en us page.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="line-clamp-2 text-muted-foreground">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
