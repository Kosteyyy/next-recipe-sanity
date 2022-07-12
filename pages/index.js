import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { sanityClient, urlFor } from "../lib/sanity";

const recipesQuery = `*[_type == "recipe"]{
  _id, name, slug, mainImage
}`;

export default function Home({ recipes }) {
  return (
    <div>
      <Head>
        <title>Kostey&rsquo; kitchen</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Welcome to Kostey&rsquo;s kitchen</h1>

      <ul className="recipes-list">
        {recipes?.length > 0 &&
          recipes.map((recipe) => (
            <li key={recipe._id} className="recipe-card">
              <Link href={`/recipes/${recipe.slug.current}`}>
                <a>
                  {/* eslint-disable-next-line */}
                  <img src={urlFor(recipe.mainImage).url()} alt="main image" />
                  <span>{recipe.name}</span>
                </a>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

export const getStaticProps = async () => {
  const recipes = await sanityClient.fetch(recipesQuery);
  return { props: { recipes } };
};
