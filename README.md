
Client side data fetching from api

 "use client";

import NewsList from "@/components/news-list";
 import { useEffect, useState } from "react";

export default function News() {
   const [error, setError] = useState();
   const [isLoading, setIsLoading] = useState(false);
   const [news, setNews] = useState();


  useEffect(function () {
     async function fetchNews() {
       setIsLoading(true);
       const response = await fetch("http://localhost:8080/news");
       if (!response.ok) {
         setError("Failed to fetch the news api");
         setIsLoading(false);
       }
       const news = await response.json();
       setIsLoading(false);
       setNews(news);
     }

     fetchNews();
   }, []);

   if (isLoading) {
     return <p>Is Loading...</p>;
   }
   if (error) {
     return <p>{error}</p>;
   }
 let newsContent;
  if (news) {
    newsContent = <NewsList news={news} />;
  }
  return (
    <>
      <h1>News Page</h1>
      {newsContent}
    </>
  );
}




Server side data fetching from api




import NewsList from "@/components/news-list";
export default async function News() {
  //server side fetching of data from api
  const response = await fetch("http://localhost:8080/news");
  const news = await response.json();
  let newsContent;

  return (
    <>
      <h1>News Page</h1>
      <NewsList news={news} />
    </>
  );
}




Without fetch we can get values from db

by placing db in the root
run command :  npm install better-sqlite3
(In this case)
then in the lib folder in news.js
Without fetch we can get values from db only in server side components

import sql from "better-sqlite3";

const db = sql("data.db");

export default function getAllNews() {
  const news = db.prepare("SELECT * FROM news").all();
  return news;
}


then in news/page.js

import NewsList from "@/components/news-list";
import getAllNews from "@/lib/news";
export default async function News() {
  const news = getAllNews();

  return (
    <>
      <h1>News Page</h1>
      <NewsList news={news} />
    </>
  );
}


Suspense component

Suspense component tells Next.js in detail for which kind of data we want to wait and under which circumstance we should show the loading page. Using <Suspense> tag

import NewsList from "@/components/news-list";
import Link from "next/link";
import {
  getAvailableNewsMonths,
  getAvailableNewsYears,
  getNewsForYear,
  getNewsForYearAndMonth,
} from "@/lib/news";
import { Suspense } from "react";

async function FilterHeader({ year, month }) {
  const avaialbleYears = await getAvailableNewsYears();
  let links = avaialbleYears;
  if (
    (year && !avaialbleYears.includes(year)) ||
    (month && !getAvailableNewsMonths(year).includes(month))
  ) {
    throw new Error("invalid filter");
  }
  if (year && !month) {
    links = getAvailableNewsMonths(year);
  }
  if (year && month) {
    links = [];
  }
  return (
    <header id="archive-header">
      <ul>
        {links.map((link) => {
          const href = year ? `/archive/${year}/${link}` : `/archive/${link}`;
          return (
            <li key={link}>
              <Link href={href}>{link}</Link>
            </li>
          );
        })}
      </ul>
    </header>
  );
}

async function FilteredNews({ year, month }) {
  let news;
  if (year && !month) {
    news = await getNewsForYear(year);
  } else if (year && month) {
    news = await getNewsForYearAndMonth(year, month);
  }
  let newsContent = <p>No news found for the selected period.</p>;
  if (news && news.length > 0) {
    newsContent = <NewsList news={news} />;
  }
  return newsContent;
}
export default async function FilteredNewsPage({ params }) {
  const filter = params.filter;
  const selectedYear = filter?.[0];
  const selectedMonth = filter?.[1];

  return (
    <>
      <Suspense fallback={<p>Loading news...</p>}>
        <FilterHeader year={selectedYear} month={selectedMonth} />

        <FilteredNews year={selectedYear} month={selectedMonth} />
      </Suspense>
    </>
  );
}


