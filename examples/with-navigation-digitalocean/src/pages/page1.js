import React from 'react';

function page1() {
  return (
    <div>
      Thanks for visiting my site, here is some cool info: My t-shirts come in
      red, blue, and green.
      <br />
      <a href={process.env.PUBLIC_PATH + 'test.txt'} download="myDownload.txt">
        download a t-shirt print here
      </a>
    </div>
  );
}

export default page1;
