import { Query, Resolver, Arg, Mutation, createUnionType } from 'type-graphql';
import { Abilities, Pokemon, PokemonAbilities, Types } from '../models';

const PokemonAbilitiesUnion = createUnionType({
  name: 'PokemonAbilitiesUnion',
  types: () => [ Pokemon, PokemonAbilities ] as const,
});

@Resolver()
export class Resolvers {
  @Query(() => [ Types ])
  async allTypes(): Promise<Types[]> {
    return await Types.find();
  }

  @Query(() => [ Abilities ])
  async allAbilities(): Promise<Abilities[]> {
    return await Abilities.find();
  }

  @Query(() => [ Pokemon ])
  async allPokemon(): Promise<Pokemon[]> {
    return await Pokemon.find();
  }

  @Query(() => [ PokemonAbilities ])
  async allPokemonAbilities(): Promise<PokemonAbilities[]> {
    return await PokemonAbilities.find();
  }

  @Query(() => Pokemon)
  async getPokemonPerName(@Arg('name') name: string): Promise<Pokemon | undefined> {
    return await Pokemon.findOne({ where: { name } });
  }

  @Query(() => [ PokemonAbilitiesUnion ])
  async getPokemonAbilities(@Arg('name') name: string): Promise<Array<typeof PokemonAbilitiesUnion>> {
    const pokemon: Pokemon = <Pokemon>await Pokemon.findOne({ where: { name } });
    const pokemonAbilities = await PokemonAbilities.find({ where: { pokemon } });

    return [ pokemon, ...pokemonAbilities ];
  }

  @Mutation(() => Pokemon)
  async createPokemon(@Arg('name') name: string): Promise<Pokemon> {
    const pokemon = Pokemon.create({ name });
    await pokemon.save();

    return pokemon;
  }
}
