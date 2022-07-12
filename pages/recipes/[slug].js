import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { sanityClient, urlFor, PortableText } from "../../lib/sanity";

const recipeQuery = `*[_type=="recipe" && slug.current == $slug][0]{
    _id, name, slug,
    mainImage,
    ingredient[]{
        _key, unit, wholeNumber, fraction, ingredient->{name}
    },
    instructions, 
    likes
}`;

export default function OneRecipe({ data }) {
  const router = useRouter();
  const [likes, setLikes] = useState(data?.recipe?.likes);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const { recipe } = data;
  //   if (!data) return <div>Loading...</div>;
  //   const { data: recipe } = usePreviewSubscription(recipeQuery, {
  //     params: { slug: data.recipe?.slug.current },
  //     initialData: data,
  //     enabled: preview,
  //   });

  //   const { recipe } = data;

  const addLike = async () => {
    const res = await fetch("/api/handle-like", {
      method: "POST",
      body: JSON.stringify({ _id: recipe._id }),
    }).catch((error) => console.log(error));

    const data = await res.json();
    setLikes(data.likes);
  };

  return (
    <article className="recipe">
      <h1>{recipe.name}</h1>
      <button className="like-button" onClick={addLike}>
        {likes} ❤️
      </button>
      <main className="content">
        <Image src={urlFor(recipe?.mainImage)} alt={recipe.name} />
        <div className="breakdown">
          <ul className="ingredients">
            {recipe.ingredient?.map((ingredient) => (
              <li key={ingredient._key} className="ingredient">
                {ingredient?.wholeNumber}
                {ingredient?.fraction} {ingredient?.unit}
                <br />
                {ingredient?.ingredient?.name}
              </li>
            ))}
          </ul>
          <div className="instructions">
            <PortableText value={recipe?.instructions} />
          </div>
        </div>
      </main>
    </article>
  );
}

export async function getStaticPaths() {
  const paths =
    await sanityClient.fetch(`*[_type == "recipe" && defined(slug.current)]{
        "params": {
            "slug": slug.current
        }
    }`);
  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  // params будут из запроса paths
  const { slug } = params;
  const recipe = await sanityClient.fetch(recipeQuery, { slug });
  console.log(recipe);
  return { props: { data: { recipe } } };
}
