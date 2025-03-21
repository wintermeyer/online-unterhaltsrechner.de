/**
 * System Test für die Collapsible-Funktionalität
 * 
 * Dieser Test überprüft, ob die Funktionalität zum Ein- und Ausklappen
 * bei allen Kinder-Elementen korrekt funktioniert.
 */

function testCollapsibleFunctionality() {
  console.log('Starting collapsible functionality test...');
  
  // 1. Teste das erste Kind (existiert beim Laden der Seite)
  console.log('Testing first child collapsible...');
  const firstChildHeader = document.querySelector('#kind1 .collapsible-header');
  const firstChildContent = document.getElementById(firstChildHeader.dataset.target);
  
  if (!firstChildHeader) {
    console.error('❌ First child header not found!');
    return;
  }
  
  if (!firstChildContent) {
    console.error('❌ First child content not found! Target ID:', firstChildHeader.dataset.target);
    return;
  }
  
  // Teste Ausklappen des ersten Kindes
  console.log('Testing expand on first child...');
  firstChildHeader.click();
  setTimeout(() => {
    if (firstChildContent.style.maxHeight !== '0px' && 
        !firstChildHeader.classList.contains('collapsed')) {
      console.log('✅ First child expands correctly');
    } else {
      console.error('❌ First child failed to expand!');
      console.log('Header classes:', firstChildHeader.className);
      console.log('Content maxHeight:', firstChildContent.style.maxHeight);
    }
    
    // Teste Einklappen des ersten Kindes
    console.log('Testing collapse on first child...');
    firstChildHeader.click();
    setTimeout(() => {
      if (firstChildContent.style.maxHeight === '0px' && 
          firstChildHeader.classList.contains('collapsed')) {
        console.log('✅ First child collapses correctly');
      } else {
        console.error('❌ First child failed to collapse!');
        console.log('Header classes:', firstChildHeader.className);
        console.log('Content maxHeight:', firstChildContent.style.maxHeight);
      }
      
      // 2. Füge ein zweites Kind hinzu und teste es
      console.log('Adding second child...');
      document.getElementById('addChildBtn').click();
      
      setTimeout(() => {
        // Überprüfe, ob das zweite Kind hinzugefügt wurde
        const secondChildHeader = document.querySelector('#kind2 .collapsible-header');
        const secondChildContent = document.getElementById(secondChildHeader.dataset.target);
        
        if (!secondChildHeader) {
          console.error('❌ Second child header not found!');
          return;
        }
        
        if (!secondChildContent) {
          console.error('❌ Second child content not found! Target ID:', secondChildHeader.dataset.target);
          console.log('Available content elements:', document.querySelectorAll('.collapsible-content').length);
          return;
        }
        
        // Teste Ausklappen des zweiten Kindes
        console.log('Testing expand on second child...');
        secondChildHeader.click();
        setTimeout(() => {
          if (secondChildContent.style.maxHeight !== '0px' && 
              !secondChildHeader.classList.contains('collapsed')) {
            console.log('✅ Second child expands correctly');
          } else {
            console.error('❌ Second child failed to expand!');
            console.log('Header classes:', secondChildHeader.className);
            console.log('Content maxHeight:', secondChildContent.style.maxHeight);
          }
          
          // Teste Einklappen des zweiten Kindes
          console.log('Testing collapse on second child...');
          secondChildHeader.click();
          setTimeout(() => {
            if (secondChildContent.style.maxHeight === '0px' && 
                secondChildHeader.classList.contains('collapsed')) {
              console.log('✅ Second child collapses correctly');
              console.log('✅ All tests passed!');
            } else {
              console.error('❌ Second child failed to collapse!');
              console.log('Header classes:', secondChildHeader.className);
              console.log('Content maxHeight:', secondChildContent.style.maxHeight);
            }
            
            // Überprüfe alle data-target und entsprechende IDs
            console.log('Checking all data-targets and corresponding IDs...');
            const allHeaders = document.querySelectorAll('.collapsible-header');
            allHeaders.forEach(header => {
              const targetId = header.dataset.target;
              const targetElement = document.getElementById(targetId);
              console.log(`Header target: ${targetId}, Target exists: ${targetElement !== null}`);
            });
            
          }, 300);
        }, 300);
      }, 300);
    }, 300);
  }, 300);
}

// Füge einen Button zur Seite hinzu, um den Test zu starten
function addTestButton() {
  const testButton = document.createElement('button');
  testButton.textContent = 'Run Collapsible Test';
  testButton.style.position = 'fixed';
  testButton.style.bottom = '10px';
  testButton.style.right = '10px';
  testButton.style.zIndex = '9999';
  testButton.style.backgroundColor = '#4f46e5';
  testButton.style.color = 'white';
  testButton.style.padding = '8px 16px';
  testButton.style.border = 'none';
  testButton.style.borderRadius = '4px';
  testButton.style.cursor = 'pointer';
  
  testButton.addEventListener('click', testCollapsibleFunctionality);
  
  document.body.appendChild(testButton);
}

// Führe den Test aus, wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', function() {
  console.log('Collapsible test script loaded.');
  addTestButton();
});
