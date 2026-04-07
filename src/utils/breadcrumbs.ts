export const generateBreadcrumbs = (
  pathname: string,
  exploreTab?: string
) => {
  const segments = pathname.split("/").filter(Boolean);

  const nameMap: Record<string, string> = {
    explore: "Explore",
    "creator-profile": "Creator Profile",
    "post-details": "Post",
    "product-details": "Product",
    membership: "Membership",
    about: "About",
    message: "Message",
  };

  let breadcrumbs: { label: string; href: string }[] = [];

  // ✅ Special case: /message/:id → only show "Message"
  if (segments[0] === "message") {
    return [
      {
        label: "Message",
        href: "/message",
      },
    ];
  }

  // ✅ Normal breadcrumb generation
  segments.forEach((segment, index) => {
    breadcrumbs.push({
      label: nameMap[segment] || segment,
      href: "/" + segments.slice(0, index + 1).join("/"),
    });
  });

  // // ✅ explore tab handling
  // if (pathname.startsWith("/explore") && exploreTab === "browse") {
  //   breadcrumbs.push({
  //     label: "Browse Creators",
  //     href: "#",
  //   });
  // }

  return breadcrumbs;
};