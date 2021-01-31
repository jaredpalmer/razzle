import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, Index, ManyToOne } from 'typeorm';
import { Abilities } from './Abilities';
import { Pokemon } from './Pokemon';

@Entity()
@Index([ 'pokemon', 'ability' ], { unique: true })
@ObjectType()
export class PokemonAbilities extends BaseEntity {
  @Field(() => Pokemon)
  @ManyToOne(
    type => Pokemon,
    pokemon => pokemon,
    {
      primary: true,
      eager: true,
    },
  )
  pokemon: Pokemon;

  @Field(() => Abilities)
  @ManyToOne(
    type => Abilities,
    abilities => abilities,
    {
      primary: true,
      eager: true,
    },
  )
  ability: Abilities;

  constructor(pokemon: Pokemon, ability: Abilities) {
    super();
    this.pokemon = pokemon;
    this.ability = ability;
  }
}
