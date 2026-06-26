"use client";
import BrowseCreators from "@/components/ui/fans/explore/Browse-Creators";
import FriendsFlirting from "@/components/ui/fans/explore/Friends-Flirting";
import MyCreator from "@/components/ui/fans/explore/My-Creator";
import TabsSelect from "./TabsSelect";

export function ExploreTabs({ response, tab, categories }: {
  response: any, tab: string, categories?: {
    _id: string;
    name: string;
    image: string;
  }[]
}) {
  return (
    <div className="">
      <TabsSelect />

      {/* Tab Content */}
      {tab === "browse" ? (<BrowseCreators creatorData={response?.data} categories={categories} />) :
        tab === "my-creator" ? (<MyCreator creatorData={response?.data} />) : tab === "friends"
          ? (<FriendsFlirting friendsData={response?.data} />) : <BrowseCreators creatorData={response?.data} categories={categories} />}
    </div>
  );
}
