//dummyFromOurBlogResult.ts

import { dummyFromOurBlogResult } from "../../../data/dummyFromOurBlogResult";
import "./fromOurBlogResult.scss";

export default function FromOurBlog() {
  return (
    <div className="fromOurBlogWrapper">
      <div className="fromOurBlogTittle">
        <h3>From Our Blog</h3>
      </div>
      <div className="fromOurBlogContent">
        {dummyFromOurBlogResult.results.map((item, index) => (
          <div className="fromOurBlogCard" key={index}>
            <div className="fromOurBlogCardImage">
              <img src={item.image} alt={item.tittle} />
            </div>
            <div className="content">
              <div className="fromOurBlogCardTag">
                <p>{item.tag}</p>
              </div>
              <div className="fromOurBlogCardTittle">
                <p>{item.tittle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <a href="/">
        <button className="fromOurBlogButton">View All</button>
      </a>
    </div>
  );
}
