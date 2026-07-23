/**
 * Free alternatives to premium GSAP plugins (SplitText & DrawSVG)
 */

export function splitTextToChars(element: HTMLElement | null): HTMLElement[] {
  if (!element) return [];
  
  const text = element.innerText;
  element.innerHTML = '';
  element.style.opacity = '1'; // Ensure it's visible if it was hidden

  const chars: HTMLElement[] = [];
  
  // Split by words first to maintain word wrapping
  const words = text.split(' ');
  
  words.forEach((word, wordIndex) => {
    const wordSpan = document.createElement('span');
    wordSpan.style.display = 'inline-block';
    wordSpan.style.whiteSpace = 'nowrap';
    
    // Split word into characters
    const letters = word.split('');
    letters.forEach((char) => {
      const charSpan = document.createElement('span');
      charSpan.style.display = 'inline-block';
      charSpan.innerText = char;
      wordSpan.appendChild(charSpan);
      chars.push(charSpan);
    });
    
    element.appendChild(wordSpan);
    
    // Add space after word if it's not the last word
    if (wordIndex < words.length - 1) {
      const spaceSpan = document.createElement('span');
      spaceSpan.style.display = 'inline-block';
      spaceSpan.innerHTML = '&nbsp;';
      element.appendChild(spaceSpan);
    }
  });
  
  return chars;
}

export function splitTextToWords(element: HTMLElement | null): HTMLElement[] {
  if (!element) return [];
  
  const text = element.innerText;
  element.innerHTML = '';
  element.style.opacity = '1';

  const wordSpans: HTMLElement[] = [];
  const words = text.split(' ');
  
  words.forEach((word, wordIndex) => {
    const wordSpan = document.createElement('span');
    // For words, we often want to animate overflow hidden or Y translation
    wordSpan.style.display = 'inline-block';
    
    // Create an inner wrapper for the actual animation if we want a clip effect
    const innerSpan = document.createElement('span');
    innerSpan.style.display = 'inline-block';
    innerSpan.innerText = word;
    
    wordSpan.appendChild(innerSpan);
    wordSpans.push(innerSpan);
    
    element.appendChild(wordSpan);
    
    if (wordIndex < words.length - 1) {
      const spaceSpan = document.createElement('span');
      spaceSpan.style.display = 'inline-block';
      spaceSpan.innerHTML = '&nbsp;';
      element.appendChild(spaceSpan);
    }
  });
  
  return wordSpans;
}

/**
 * Prepares an SVG path for drawing animation.
 * Returns the total length so you can animate strokeDashoffset from length to 0.
 */
export function setupDrawSVG(pathElement: SVGPathElement | null): number {
  if (!pathElement) return 0;
  
  const length = pathElement.getTotalLength();
  
  pathElement.style.strokeDasharray = `${length} ${length}`;
  pathElement.style.strokeDashoffset = `${length}`;
  
  return length;
}
