import { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import matchSorter from 'match-sorter';
import cn from 'classnames';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Item = ({ title, active, href, onMouseOver, search }) => {
  const highlight = title.toLowerCase().indexOf(search.toLowerCase());

  return (
    <Link href={href}>
      <a className="block no-underline" onMouseOver={onMouseOver}>
        <li
          className={cn('py-2 px-3  text-gray-800', {
            'bg-gray-100': active,
          })}
        >
          {title.substring(0, highlight)}
          <span className="bg-teal-300">
            {title.substring(highlight, highlight + search.length)}
          </span>
          {title.substring(highlight + search.length)}
        </li>
      </a>
    </Link>
  );
};

const Search = ({ directories }) => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef(null);

  const results = useMemo(() => {
    if (!search) return [];

    // Will need to scrape all the headers from each page and search through them here
    // (similar to what we already do to render the hash links in sidebar)
    // We could also try to search the entire string text from each page
    return matchSorter(directories, search, { keys: ['title'] });
  }, [search]);

  const handleKeyDown = useCallback(
    (e) => {
      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          if (active + 1 < results.length) {
            setActive(active + 1);
          }
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          if (active - 1 >= 0) {
            setActive(active - 1);
          }
          break;
        }
        case 'Enter': {
          router.push(results[active].route);
          break;
        }
      }
    },
    [active, results, router]
  );

  useEffect(() => {
    setActive(0);
  }, [search]);

  useEffect(() => {
    const inputs = ['input', 'select', 'button', 'textarea'];

    const down = (e) => {
      if (
        document.activeElement &&
        inputs.indexOf(document.activeElement.tagName.toLowerCase() !== -1)
      ) {
        if (e.key === '/') {
          e.preventDefault();
          input.current.focus();
        } else if (e.key === 'Escape') {
          setShow(false);
        }
      }
    };

    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, []);

  const renderList = show && results.length > 0;

  return (
    <div className="relative w-full md:w-64 mr-2">
      {renderList && (
        <div className="search-overlay z-1" onClick={() => setShow(false)} />
      )}
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-4 w-4 text-gray-400"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <input
        onChange={(e) => {
          setSearch(e.target.value);
          setShow(true);
        }}
        className="appearance-none pl-8 border rounded-md py-2 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
        type="search"
        placeholder='Search ("/" to focus)'
        onKeyDown={handleKeyDown}
        onFocus={() => setShow(true)}
        ref={input}
        aria-label="Search documentation"
      />
      {renderList && (
        <ul className="shadow-md list-none p-0 m-0 absolute left-0 md:right-0 bg-white rounded-md mt-1 border top-100 divide-y divide-gray-300 z-2">
          {results.map((res, i) => {
            return (
              <Item
                key={`search-item-${i}`}
                title={res.title}
                href={res.route}
                active={i === active}
                search={search}
                onMouseOver={() => setActive(i)}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Search;
