document.addEventListener('DOMContentLoaded', function() {
    // Candidates data with party affiliations
    const candidates = [
        { id: 1, name: "Odie Dog", party: "Gamer Ballsack Party" },
        { id: 2, name: "Worm NOOBA Kennedy", party: "Rebablicans" },
        { id: 3, name: "General Skullaton Skoetini", party: "BULLSHIT Party" },
        { id: 4, name: "Waffle Johnson", party: "Sonichu-Sonadow" },
        { id: 5, name: "Coal Kennnedy", party: "Do the Dew! - Rebablican" },
        { id: 6, name: "Neil Oneoky", party: "Brotherhood of Poopman" },
        { id: 7, name: "Nothing Click", party: "ESRB" },
        { id: 8, name: "Ethan Alexander Young", party: "Parkour and Hacking" },
        { id: 9, name: "Lolman Sevenoseven", party: "The Motherfucking Party" },
        { id: 10, name: "Clomik Yankovic", party: "Socialists" },
        { id: 11, name: "Jukey Jukeson", party: "QuintonLegacy" },
        { id: 12, name: "Moss Jacobson", party: "Maossist Party" },
        { id: 13, name: "Big Trumps", party: "PFBFAWGFUAEAFBTV" },
        { id: 14, name: "Ultimate Hampleton", party: "PGBR Military" },
        { id: 15, name: "Ilker \"Ugnilort\"", party: "TAP!" },
        { id: 16, name: "Rob Van Keobis", party: "Femboy Natsocs" }
    ];

    // Party colors for visual identification
    const partyColors = {
        "Gamer Ballsack Party": "#4d88ff",
        "Rebablicans": "#e00f20",
        "BULLSHIT Party": "#03e8fc",
        "Sonichu-Sonadow": "#fff700",
        "Do the Dew! - Rebablican": "#00ff00",
        "Brotherhood of Poopman": "#ff5c00",
        "ESRB": "#fcba03",
        "Parkour and Hacking": "#fcba03",
        "The Motherfucking Party": "#2d3c8c",
        "Socialists": "#e00f20",
        "QuintonLegacy": "#1b9e56",
        "Maossist Party": "#660000",
        "PFBFAWGFUAEAFBTV": "#000000",
        "PGBR Military": "#2e422a",
        "TAP!": "#654321",
        "Femboy Natsocs": "#ff69b4"
    };

    // Initialize vote storage if it doesn't exist
    if (!localStorage.getItem('electionVotes')) {
        const initialVotes = {};
        candidates.forEach(candidate => {
            initialVotes[candidate.id] = 0;
        });
        localStorage.setItem('electionVotes', JSON.stringify(initialVotes));
    }

    // Check if user has already voted (simulating IP-based voting restriction)
    function hasVoted() {
        return localStorage.getItem('hasVoted') === 'true';
    }

    // Mark user as having voted
    function markAsVoted() {
        localStorage.setItem('hasVoted', 'true');
    }

    // Get current vote counts
    function getVotes() {
        return JSON.parse(localStorage.getItem('electionVotes'));
    }

    // Update vote counts
    function updateVotes(candidateId) {
        const votes = getVotes();
        votes[candidateId]++;
        localStorage.setItem('electionVotes', JSON.stringify(votes));
    }

    // Set custom vote counts (admin function)
    function setCustomVotes(newVotes) {
        localStorage.setItem('electionVotes', JSON.stringify(newVotes));
    }

    // Display candidates
    function displayCandidates() {
        const container = document.getElementById('candidates-container');
        container.innerHTML = '';
        
        candidates.forEach(candidate => {
            const card = document.createElement('div');
            card.className = 'candidate-card';
            
            const partyBadge = document.createElement('div');
            partyBadge.className = 'candidate-party';
            partyBadge.textContent = candidate.party;
            partyBadge.style.backgroundColor = partyColors[candidate.party];
            
            const voteButton = document.createElement('button');
            voteButton.className = 'vote-btn';
            voteButton.textContent = 'Vote';
            voteButton.dataset.id = candidate.id;
            
            if (hasVoted()) {
                voteButton.disabled = true;
                voteButton.textContent = 'Already Voted';
            }
            
            card.innerHTML = `<h3 class="candidate-name">${candidate.name}</h3>`;
            card.appendChild(partyBadge);
            card.appendChild(voteButton);
            
            container.appendChild(card);
        });
    }

    // Display vote results
    function displayResults() {
        const container = document.getElementById('results-container');
        container.innerHTML = '';
        
        const votes = getVotes();
        const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
        
        // Create an array of candidates with their vote counts
        const candidateResults = candidates.map(candidate => {
            return {
                ...candidate,
                votes: votes[candidate.id],
                percentage: totalVotes > 0 ? (votes[candidate.id] / totalVotes * 100).toFixed(1) : 0
            };
        }).sort((a, b) => b.votes - a.votes);
        
        candidateResults.forEach(candidate => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            const resultBar = document.createElement('div');
            resultBar.className = 'result-bar';
            
            const resultFill = document.createElement('div');
            resultFill.className = 'result-fill';
            resultFill.style.width = `${candidate.percentage}%`;
            resultFill.style.backgroundColor = partyColors[candidate.party];
            
            const resultText = document.createElement('div');
            resultText.className = 'result-text';
            resultText.innerHTML = `
                <span>${candidate.name} 
                    <span class="party-badge" style="background-color: ${partyColors[candidate.party]}">
                        ${candidate.party}
                    </span>
                </span>
                <span>${candidate.votes} votes (${candidate.percentage}%)</span>
            `;
            
            resultBar.appendChild(resultFill);
            resultBar.appendChild(resultText);
            resultItem.appendChild(resultBar);
            container.appendChild(resultItem);
        });
    }

    // Display admin panel with editable vote counts
    function displayAdminPanel() {
        const container = document.getElementById('admin-votes-container');
        container.innerHTML = '';
        
        const votes = getVotes();
        
        candidates.forEach(candidate => {
            const voteItem = document.createElement('div');
            voteItem.className = 'admin-vote-item';
            
            voteItem.innerHTML = `
                <label>${candidate.name} (${candidate.party}):</label>
                <input type="number" min="0" value="${votes[candidate.id]}" data-id="${candidate.id}">
            `;
            
            container.appendChild(voteItem);
        });
    }

    // Handle voting
    document.getElementById('candidates-container').addEventListener('click', function(e) {
        if (e.target.classList.contains('vote-btn') && !e.target.disabled) {
            const candidateId = parseInt(e.target.dataset.id);
            
            // Update votes
            updateVotes(candidateId);
            markAsVoted();
            
            // Show success message
            const messageBox = document.getElementById('message-box');
            messageBox.className = 'success';
            messageBox.textContent = 'Your vote has been recorded successfully!';
            messageBox.style.display = 'block';
            
            // Disable all vote buttons
            const voteButtons = document.querySelectorAll('.vote-btn');
            voteButtons.forEach(button => {
                button.disabled = true;
                button.textContent = 'Already Voted';
            });
            
            // Hide message after 3 seconds
            setTimeout(() => {
                messageBox.style.display = 'none';
            }, 3000);
        }
    });

    // Admin login modal
    document.getElementById('admin-login-trigger').addEventListener('click', function() {
        document.getElementById('admin-login-modal').classList.remove('hidden');
    });

    document.getElementById('admin-cancel-btn').addEventListener('click', function() {
        document.getElementById('admin-login-modal').classList.add('hidden');
    });

    // Admin login
    document.getElementById('admin-login-btn').addEventListener('click', function() {
        const password = document.getElementById('admin-password').value;
        
        if (password === 'MAT991ira') {
            document.getElementById('admin-login-modal').classList.add('hidden');
            document.getElementById('voting-section').classList.add('hidden');
            document.getElementById('results-section').classList.add('hidden');
            document.getElementById('admin-panel').classList.remove('hidden');
            displayAdminPanel();
        } else {
            alert('Incorrect password!');
        }
    });

    // Update votes (admin function)
    document.getElementById('update-votes').addEventListener('click', function() {
        const inputs = document.querySelectorAll('#admin-votes-container input');
        const newVotes = {};
        
        inputs.forEach(input => {
            const candidateId = parseInt(input.dataset.id);
            newVotes[candidateId] = parseInt(input.value) || 0;
        });
        
        setCustomVotes(newVotes);
        
        // Show success message
        alert('Vote counts have been updated successfully!');
    });

    // Admin logout
    document.getElementById('admin-logout').addEventListener('click', function() {
        document.getElementById('admin-panel').classList.add('hidden');
        document.getElementById('voting-section').classList.remove('hidden');
    });

    // View results
    document.getElementById('view-results').addEventListener('click', function() {
        document.getElementById('voting-section').classList.add('hidden');
        document.getElementById('admin-panel').classList.add('hidden');
        document.getElementById('results-section').classList.remove('hidden');
        displayResults();
    });

    // Back to voting
    document.getElementById('back-to-voting').addEventListener('click', function() {
        document.getElementById('results-section').classList.add('hidden');
        document.getElementById('voting-section').classList.remove('hidden');
    });

    // Initialize the page
    displayCandidates();
});