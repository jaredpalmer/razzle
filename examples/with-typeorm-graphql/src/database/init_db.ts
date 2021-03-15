
import { Abilities, Pokemon, PokemonAbilities, Types } from '../models';

export const init_db = async(connection) => {
  await connection.dropDatabase();
  await connection.synchronize();

  // Types
  const electric = new Types();
  electric.name = 'Electric';
  await electric.save();

  const fire = new Types();
  fire.name = 'Fire';
  await fire.save();

  const water = new Types();
  water.name = 'Water';
  await water.save();

  const grass = new Types();
  grass.name = 'Grass';
  await grass.save();

  // Abilities
  const razorLeaf = new Abilities();
  razorLeaf.name = 'Razor Leaf';
  await razorLeaf.save();

  const flameCharge = new Abilities();
  flameCharge.name = 'Flame Charge';
  await flameCharge.save();

  const flareBlitz = new Abilities();
  flareBlitz.name = 'Flare Blitz';
  await flareBlitz.save();

  const soak = new Abilities();
  soak.name = 'Soak';
  await soak.save();

  const electrify = new Abilities();
  electrify.name = 'Electrify';
  await electrify.save();

  const spark = new Abilities();
  spark.name = 'Spark';
  await spark.save();


  // Pokémon
  const pikachu = new Pokemon(electric);
  pikachu.name = 'Pikachu';
  await pikachu.save();

  const boltund = new Pokemon(electric);
  boltund.name = 'Boltund';
  await boltund.save();

  const octillery = new Pokemon(water);
  octillery.name = 'Octillery';
  await octillery.save();

  const ponyta = new Pokemon(fire);
  ponyta.name = 'Ponyta';
  await ponyta.save();

  const raboot = new Pokemon(fire);
  raboot.name = 'Raboot';
  await raboot.save();

  const grookey = new Pokemon(grass);
  grookey.name = 'Grookey';
  await grookey.save();

  // Pokemon-Abilities
  const grookeyRazorLeaf = new PokemonAbilities(grookey, razorLeaf);
  await grookeyRazorLeaf.save();

  const ponytaFlameCharge = new PokemonAbilities(ponyta, flameCharge);
  await ponytaFlameCharge.save();

  const rabootFlameCharge = new PokemonAbilities(raboot, flameCharge);
  await rabootFlameCharge.save();

  const ponytaFlareBlitz = new PokemonAbilities(ponyta, flareBlitz);
  await ponytaFlareBlitz.save();

  const octillerySoak = new PokemonAbilities(octillery, soak);
  await octillerySoak.save();

  const boltundElectrify = new PokemonAbilities(boltund, electrify);
  await boltundElectrify.save();

  const boltundSpark = new PokemonAbilities(boltund, spark);
  await boltundSpark.save();

  const pikachuSpark = new PokemonAbilities(pikachu, spark);
  await pikachuSpark.save();
};
