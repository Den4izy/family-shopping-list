import Link from "next/link";

const menuCards = [
  {
    href: "/shopping",
    title: "Планування покупок",
    text: "Спільний список покупок з історією купленого.",
    accent: "active",
  },
  {
    href: "#",
    title: "Сімейна галерея",
    text: "Плитка для фотоальбому, який додамо пізніше.",
    accent: "soon",
  },
] as const;

export default function Home() {
  return (
    <main className="home-shell">
      <section className="home-hero">
        <p className="eyebrow">Сімейний сайт</p>
        <h1>Просте меню для всіх сімейних розділів.</h1>
        <p className="subtitle">
          Тут будуть головні точки входу: покупки, галерея та інші корисні
          розділи, які додамо пізніше.
        </p>
      </section>

      <section className="menu-grid" aria-label="Меню сайту">
        {menuCards.map((card) =>
          card.href === "#" ? (
            <div className={`menu-card menu-card--${card.accent}`} key={card.title}>
              <span className="menu-card__badge">Скоро</span>
              <h2>{card.title}</h2>
              <p>{card.text}</p>
            </div>
          ) : (
            <Link className={`menu-card menu-card--${card.accent}`} href={card.href} key={card.title}>
              <span className="menu-card__badge">Відкрити</span>
              <h2>{card.title}</h2>
              <p>{card.text}</p>
            </Link>
          ),
        )}
      </section>
    </main>
  );
}
