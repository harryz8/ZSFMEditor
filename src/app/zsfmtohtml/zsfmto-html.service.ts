import { Injectable } from '@angular/core';
import { NgbNavLinkBase } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ZSFMToHTMLService {

  private startsWithPatternRecog(search : string, pattern : string) : [number, number] {
    let lines = search.split("\n");
    let iterator = 0;
    while (!lines[iterator].startsWith(pattern)) {
      iterator++;
      if (iterator >= lines.length) {
        return [-1, -1];
      }
    }
    let iterator2 = iterator;
    while (lines[iterator2].startsWith(pattern)) {
      iterator2++;
      if (iterator2 >= lines.length) {
        return [-1, -1];
      }
    }
    let start = 0;
    for (let i = 0; i<iterator; i++) {
      start += lines[i].length+1;
    }
    let end = -1;
    for (let j = 0; j<iterator2; j++) {
      end += lines[j].length+1;
    }
    return [start, end];
  }

  private replaceAllPrefixes(search : string, target : string, replace : string) : string {
    let lines = search.split("\n");
    let newstring = "";
    for (let line of lines) {
      if (line.startsWith(target)) {
        newstring += replace;
        newstring += line.substring(target.length);
      }
      else {
        newstring += line;
      }
      newstring += "\n";
    }
    newstring = newstring.substring(0, newstring.length-1);
    return newstring;
  }

  private bookendAllStartsWithPatterns(search : string, pattern : string, startBookend : string, endBookend : string, deleteStartsWith : boolean) : string {
    let [a, b] = this.startsWithPatternRecog(search, pattern);
    if (a === -1 || b === -1) {
      return search;
    }
    if (deleteStartsWith) {
      return search.substring(0, a)
      + startBookend 
      + this.replaceAllPrefixes(search.substring(a, b), pattern, "") 
      + endBookend 
      + this.bookendAllStartsWithPatterns(search.substring(b), pattern, startBookend, endBookend, deleteStartsWith);
    }
    return search.substring(0, a) + startBookend + search.substring(a, b) + endBookend + this.bookendAllStartsWithPatterns(search.substring(b), pattern, startBookend, endBookend, deleteStartsWith);
  }

  private replaceAll(search : string, target : string, replace : string) : string {
    if (search.indexOf(target) !== -1) {
      let loc = search.indexOf(target);
      search = search.substring(0, loc) + replace + search.substring(loc+target.length);
      search = search.substring(0, loc+replace.length) + this.replaceAll(search.substring(loc+replace.length), target, replace);
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
    html = this.replaceAll(html, "&", "&amp;");

    //introducing &
    html = this.replaceAll(html, "<", "&lt;");
    html = this.replaceAll(html, ">", "&gt;");
    html = this.replaceAll(html, "\"", "&quot;");
    html = this.replaceAll(html, "\'", "&apos;");
    html = this.replaceAll(html, "£", "&pound;");
    html = this.replaceAll(html, "€", "&euro;");

    html = this.bookendAllStartsWithPatterns(html, "&gt; ", "<blockquote>", "</blockquote>", true);

    html = this.replaceAll(html, "---", "<hr />");

    html = this.replaceAndSurroundAll(html, "### ", "\n", "<h3>", "</h3>");
    html = this.replaceAndSurroundAll(html, "## ", "\n", "<h2>", "</h2>");
    html = this.replaceAndSurroundAll(html, "# ", "\n", "<h1>", "</h1>");
    html = this.replaceAndSurroundAll(html, "**", "**", "<strong>", "</strong>");
    html = this.replaceAndSurroundAll(html, "*", "*", "<i>", "</i>");
    html = this.replaceAndSurroundAll(html, "`", "`", "<code>", "</code>");
    //must go last
    html = this.replaceAndSurroundAll(html, "### ", "END", "<h3>", "</h3>");
    html = this.replaceAndSurroundAll(html, "## ", "END", "<h2>", "</h2>");
    html = this.replaceAndSurroundAll(html, "# ", "END", "<h1>", "</h1>");
    // introducing < and >
    html = this.replaceAll(html, "\n", "<br />");
    html = this.replaceAll(html, "#", "&#35;")
    return html;
  }
}
