import { BaseEntity, Entity, Index, ManyToOne } from 'typeorm';
import { Abilities } from './Abilities';
import { Pokemon } from './Pokemon';

@Entity()
@Index([ 'pokemon', 'ability' ], { unique: true })
export class PokemonAbilities extends BaseEntity {
  @ManyToOne('Pokemon', 'pokemon',
    {
      primary: true,
      eager: true,
    },
  )
  pokemon: Pokemon;

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
