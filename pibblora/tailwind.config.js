export default {
  content: ['./index.html','./popup.html','./newtab.html','./src/**/*.{ts,tsx}','./extension/**/*.ts'],
  theme: {
    extend: {
      colors: { lavender:'#C9B6FF', pink:'#FFC9DE', blue:'#BDE7FF', mint:'#C6F4DC', cream:'#FFF5E8', ink:'#443B52' },
      fontFamily: { display: ['"Baloo 2"','ui-rounded','system-ui','sans-serif'], body: ['Nunito','ui-rounded','system-ui','sans-serif'] }
    }
  }
}