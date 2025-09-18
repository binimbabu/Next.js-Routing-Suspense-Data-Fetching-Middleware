import { DUMMY_NEWS } from "@/dummy-news";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getNewsItem } from "@/lib/news";
export default async function NewsDetailsPage({ params }) {
  let newsSlug = params.slug;
  const newItem = await getNewsItem(newsSlug);
  // let newItem = DUMMY_NEWS.find((item) => item.slug === newsSlug);

  if (!newItem) notFound();
  return (
    <article className="news-article">
      <header>
        <Link href={`/news/${newItem.slug}/image`}>
          <img src={`/images/news/${newItem.image}`} alt={newItem.title} />
        </Link>
        <h1>{newItem.title} </h1>
        <time dateTime={newItem.date}>{newItem.date}</time>
      </header>
      <p>{newItem.content}</p>
    </article>
  );
}
