import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ZSFMToHTMLService {

  private replaceAll(search : string, target : string, replace : string) : string {
    while (search.indexOf(target) !== -1) {
      search = search.substring(0, search.indexOf(target)) + replace + search.substring(search.indexOf(target)+target.length);
    }
    return search;
  }

  private replace(search : string, target : string, replace : string) : string {
    if (search.indexOf(target) !== -1) {
      search = search.substring(0, search.indexOf(target)) + replace + search.substring(search.indexOf(target)+target.length);
    }
    return search;
  }

  private replaceAndSurroundAll(search : string, startTarget : string, endTarget : string, startReplace : string, endReplace : string) : string {
    let orig : string;
    while (true) {
      let start = search.indexOf(startTarget);
      orig = search;
      if (start === -1) {
        break;
      }
      if (endTarget !== "END") {
        search = search.substring(0, start+startTarget.length)+this.replace(search.substring(start+startTarget.length), endTarget, endReplace);
      }
      else {
        search = search + endReplace;
      }
      if (!(search === orig && search.length === orig.length)) {
        search = this.replace(search, startTarget, startReplace);
      }
      else {
        break;
      }
    }
    return search;
  }

  public ZSFMToHTML(zsfm : string) : string {
    let html = zsfm;
    // order is important
    html = this.replaceAll(html, "<", "&lt;");
    html = this.replaceAll(html, ">", "&gt;");
    html = this.replaceAndSurroundAll(html, "### ", "\n", "<h3>", "</h3>");
    html = this.replaceAndSurroundAll(html, "### ", "\n", "<h3>", "</h3>");
    html = this.replaceAndSurroundAll(html, "## ", "\n", "<h2>", "</h2>");
    html = this.replaceAndSurroundAll(html, "# ", "\n", "<h1>", "</h1>");
    html = this.replaceAndSurroundAll(html, "**", "**", "<strong>", "</strong>");
    //must go last
    html = this.replaceAndSurroundAll(html, "### ", "END", "<h3>", "</h3>");
    html = this.replaceAndSurroundAll(html, "## ", "END", "<h2>", "</h2>");
    html = this.replaceAndSurroundAll(html, "# ", "END", "<h1>", "</h1>");
    return html;
  }
}
