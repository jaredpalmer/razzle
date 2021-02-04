import { BaseEntity, Entity, Index, ManyToOne } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Abilities } from './Abilities';
import { Pokemon } from './Pokemon';

@Entity()
@Index([ 'pokemon', 'ability' ], { unique: true })
@ObjectType()
class PokemonAbilities extends BaseEntity {
  
  @Field(() => Pokemon)
  @ManyToOne('Pokemon', 'pokemon',
    {
      primary: true,
      eager: true,
    },
  )
  pokemon: Pokemon;

  @Field(() => Abilities)
  @ManyToOne('Abilities', 'abilities',
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

export { PokemonAbilities };
