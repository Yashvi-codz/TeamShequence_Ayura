import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const food1 = searchParams.get("food1");
  const food2 = searchParams.get("food2");

  if (!food1 || !food2) {
    return NextResponse.json(
      { error: "Missing foods" },
      { status: 400 }
    );
  }

  const combos = {
    "milk_fish": {
      compatibility: "poor",
      explanation:
        "Milk and fish together disturb digestion and create toxins (ama).",
      doshaImpact: {
        vata: "increase",
        pitta: "increase",
        kapha: "increase",
      },
      alternatives: [
        "Have fish with rice instead",
        "Drink milk after 2 hours",
      ],
    },

    "rice_mung dal": {
      compatibility: "excellent",
      explanation:
        "Rice and mung dal form a complete protein and are very easy to digest.",
      doshaImpact: {
        vata: "balance",
        pitta: "balance",
        kapha: "balance",
      },
      alternatives: [],
    },
  };

  const key1 = `${food1}_${food2}`;
  const key2 = `${food2}_${food1}`;

  const result =
    combos[key1] ||
    combos[key2] || {
      compatibility: "good",
      explanation:
        "This combination is generally safe but depends on digestion strength.",
      doshaImpact: {
        vata: "neutral",
        pitta: "neutral",
        kapha: "neutral",
      },
      alternatives: [],
    };

  return NextResponse.json(result);
}
