
In 'app' folder we set different pages that we want on overall website. 'page.js' tells Nextjs that it should render a page ('page.js' a react function and 'page.js' is a server component, Nextjs ensures that 'page.js' is rendered on the server and executed on server, terminal in vscode is running on server) and 'layout.js'. Next.js has server components that are rendered and converted to HTML which is sent to browser. For example need to add a page called 'http://localhost:3000/about' we can do it in 'app' folder by adding the routes in 'app' folder by adding folders in 'app' folder. If we want to add 'http://localhost:3000/about' we need to add 'about' folder inside 'app' folder.  Additionally we need to create a file called 'page.js' inside 'about' folder to render a page.
Next.js have reserved filenames. But filename only matter inside app folder.

page.js - define page content
layout.js - define wrapper around pages
not-found.js - define 'Not found' fallback page 
error.js - define error fallback page

There is a root page inside 'app' folder which defines the content of page inside 'http://localhost:3000' and the file that defines content inside 'http://localhost:3000' is 'page.js' (inside app folder) and this 'page.js' is the root file inside app folder.

The 'page.js' inside the 'about' folder will determine that defines page content inside 'http://localhost:3000/about'.



app/about/page.js


export default function About() {
  return (
    <main >
     <p>About us</p>    
</main>
  );
}


app/page.js

import Link from 'next/link';

export default function Home() {
  return (
    <main >
     <p>About us</p>  
<p><Link to="/about>About Us</Link></p>  
</main>
  );
}


'Link' is used instead of 'a' anchor tag because when the home page is loaded and using anchor tag instead of  'Link' tag will reload and the single page application is not manitained, hence we use 'Link' which will load the content of 'http://localhost:3000/about' from Javascript client code from home page ('http://localhost:3000') will be replacing the UI to ('http://localhost:3000/about') without reloading and maintaining the single page application concept by using 'Link' instead of 'a' anchor tag. If we want to change the UI from one page to another page inside the website we use 'Link' in Nextjs. 

In 'app' folder 'layout.js' defines the shell around one or more pages . Especially 'app/page.js' place as a shell inside the 'app/layout.js'. Every Next.js application require one root 'layout.js' file that's 'app/layout.js'. In 'app/about' we can add 'layout.js' i.e 'app/about/layout.js'. In root 'layout.js' file (i.e app/layout.js) we are also exporting a React component 



app/layout.js


import './global.css';

export const metadata = {
title: 'NextJS course app',
description: 'Your first Nextjs app!'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


This 'app/layout.js' has a standard children prop (i.e 'children' ) which in React can be used by every component to inject some content between the body tags. 'RootLayout' react component renders an HTML and body tag (this is to set up HTML skeleton of the website). the 'head' tag element is placed in the 'metadata' variable. 'metadata' variable is also reserved name. 'RootLayout' isn't a reserved name. Here 'metadata' variable can have title, description and other metadata fields which is applied to all pages that are covered by the layout here inside 'app/layout.js'. All the content given in 'head' tag is set to 'metadata' variable. 'children' ( mentioned in 'app/layout.js' as props to  'RootLayout' component) denotes to the content of page that's currently active (because 'app/layout.js' is a wrapper around app/page.js or one or more pages and depending on which path you are children will be content of the page.js that's currently active). layout.js is the wrapper and page.js is the actual content that will be injected as 'children' props in the 'layout.js'.

Other reserved filenames:-

globals.css - some CSS styles and this file is imported into 'app/layout.js' and this 'globals.css' is available on every page that's being loaded.
icon.png - if we give a file named 'icon.png' in app then this image given as 'icon.png' will be set as image icon in the tab in browser. Because 'icon.png' given as favicon which is the icon to tab.






















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


