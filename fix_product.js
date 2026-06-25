const fs = require('fs');

const path = 'CMS.Backend/Views/Product/Index.cshtml';
let content = fs.readFileSync(path, 'utf8');

// Find the first occurrence of "</table>\r\n    </div>\r\n"
const tableEndIdx = content.indexOf('</table>');
const divEndIdx = content.indexOf('</div>', tableEndIdx);

// The actual end of the table div is around index of the second </div> after </table>
// Wait, a better way is to split by lines and rebuild it since I know exactly what it should look like.
