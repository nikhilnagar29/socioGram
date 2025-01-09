//like post button
                        // Wait for DOM to load
                        document.addEventListener('DOMContentLoaded', function() {
                            // Select all the like buttons
                            const likeButtons = document.querySelectorAll('.like-button');

                            // Add click event listener to each like button
                            likeButtons.forEach(button => {
                                button.addEventListener('click', async function() {
                                    const postId = button.getAttribute('data-post-id'); // Get the post ID
                                    const url = `/post/like/${postId}`;

                                    try {
                                        // Make POST request to like the post
                                        const response = await fetch(url, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' }
                                        });

                                        const result = await response.json();

                                        if (response.ok) {
                                            // Update the button text and like count
                                            const likeCountEl = button.querySelector('.like-count');
                                            const likeTextEl = button.querySelector('.like-text');

                                            likeCountEl.textContent = result.likeCount;
                                            likeTextEl.textContent = result.liked ? 'Unlike' : 'Like';
                                            button.classList.toggle('liked', result.liked);
                                        } else {
                                            console.error('Error liking post:', result.message);
                                        }
                                    } catch (err) {
                                        console.error('Network error:', err);
                                    }
                                });
                            });
                        });


                        const userIds = [
                            "677ec62e2ec12356224d33cd",
                            "677ec62e2ec12356224d33cd",
                            "677ec62e2ec12356224d33cd",
                          ];
                          
                          // Function to fetch user data from API
                          async function fetchUserData(userId) {
                            try {
                              const response = await fetch(`http://localhost:50001/api/user/${userId}`);
                              if (!response.ok) {
                                throw new Error("User not found");
                              }
                              const data = await response.json(); // Parse the JSON data
                              return data.user; // Access the user object inside the response
                            } catch (error) {
                              console.error("Error fetching user data for ID:", userId, error);
                              return null; // Return null if an error occurs
                            }
                          }
                          
                          // Function to create a user div
                          function createUserDiv(user) {
                            const profileImageSrc = user.profileImage || "path/to/default-image.jpg"; // Fallback to default image if undefined
                          
                            const userDiv = document.createElement("div");
                            userDiv.classList.add(
                              "p-4",
                              "bg-gray-900",
                              "to-black",
                              "rounded-lg",
                              "max-w-2xl",
                              "mx-auto",
                              "mt-6",
                              "relative"
                            );
                          
                            userDiv.innerHTML = `
                              <a href="/user/profile/${user._id}" class="flex space-x-4 max-w-[300px] transform transition-transform duration-300 hover:scale-110">
                                <div class="flex-none">
                                  <img src="${profileImageSrc}" alt="Profile Picture" class="w-12 h-12 rounded-full">
                                </div>
                                <div class="flex flex-col justify-center">
                                  <h5 class="text-lg font-semibold text-white">${user.username}</h5>
                                  <h6 class="text-sm text-gray-400">${user.name}</h6>
                                </div>
                              </a>
                            `;
                          
                            return userDiv;
                          }
                          
                          // Function to render all users
                          async function renderUsers() {
                            const uniqueUserIds = [...new Set(userIds)]; // Remove duplicates
                            const container = document.querySelector(".User-container-for-dev");
                          
                            if (!container) {
                              console.error("Container not found in DOM.");
                              return;
                            }
                          
                            userIds.forEach(async (userId) =>{
                              try {
                                const user = await fetchUserData(userId);
                                if (user) {
                                  const userDiv = createUserDiv(user);
                                  container.appendChild(userDiv); // Append the user div to the container
                                }
                              } catch (error) {
                                console.error(`Failed to render user with ID: ${userId}`, error);
                              }
                            })
                          }
                          
                          // Ensure DOM is fully loaded before rendering users
                          document.addEventListener("DOMContentLoaded", () => {
                            // console.log(userIds);
                            renderUsers();
                            
                          });
                          
                        
                        //for see more button 
                        // JavaScript

                    // Get references to elements
                    const content = document.getElementById('content');
                    const seeMoreBtn = document.getElementById('seeMoreBtn');

                    let isExpanded = false; // Tracks if the content is expanded

                    // Function to check if content has more than 2 lines
                    function checkContentLines() {
                        const lineHeight = parseFloat(getComputedStyle(content).lineHeight); // Get line height of content
                        const contentHeight = content.scrollHeight; // Total height of content
                        const numberOfLines = contentHeight / lineHeight; // Calculate how many lines it takes

                        if (numberOfLines <= 2) {
                            seeMoreBtn.classList.add('hidden'); // Hide See More button if less than 2 lines
                        } else {
                            seeMoreBtn.classList.remove('hidden'); // Show See More button if more than 2 lines
                        }
                    }

                    // Event listener for See More / See Less button
                    seeMoreBtn.addEventListener('click', () => {
                        if (isExpanded) {
                            content.classList.add('line-clamp-2', 'overflow-hidden');
                            seeMoreBtn.textContent = 'See More';
                        } else {
                            content.classList.remove('line-clamp-2', 'overflow-hidden'); 
                            seeMoreBtn.textContent = 'See Less';
                        }
                        seeMoreBtn.classList.toggle('mt-5');
                        isExpanded = !isExpanded;
                    });

                    // Call the function to check content lines on page load
                    checkContentLines();



                        //this is for post follows and following button
                        // Function to show a specific div and hide others
                        function showDiv(divId) {
                            // Hide all divs first
                            document.getElementById('postDiv').style.display = 'none';
                            document.getElementById('followerDiv').style.display = 'none';
                            document.getElementById('followingDiv').style.display = 'none';
                            
                            // Show the selected div
                            document.getElementById(divId).style.display = 'block';
                        }

                        // Event listeners for buttons
                        document.getElementById('postShow').addEventListener('click', function() {
                            showDiv('postDiv');
                        });

                        document.getElementById('followerShow').addEventListener('click', function() {
                            showDiv('followerDiv');
                        });

                        document.getElementById('followingShow').addEventListener('click', function() {
                            showDiv('followingDiv');
                        });

                        // Set default div to be shown
                        document.addEventListener('DOMContentLoaded', function() {
                            showDiv('postDiv');
                        });


    // Function to toggle the save status of the post
    async function toggleSave(postId) {
        try {
            // Select elements related to this specific post
            const saveButton = document.querySelector(`[data-post-id='${postId}']`);
            const saveText = document.getElementById(`saveText-${postId}`);
            const saveIcon = document.getElementById(`saveIcon-${postId}`);
    
            // Check current save state of the button
            const isSaved = saveButton.classList.contains('saved');
    
            // Determine API endpoint based on the current state
            const url = isSaved 
                ? `/activities/unsave/${postId}` 
                : `/activities/save/${postId}`;
    
            // Send the request to the server
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (!response.ok) {
                throw new Error('Failed to update save status');
            }
    
            // Toggle the button's appearance
            if (isSaved) {
                saveButton.classList.remove('saved');
                saveButton.classList.remove('text-blue-500');
                saveText.textContent = 'Save';
            } else {
                saveButton.classList.add('saved');
                saveButton.classList.add('text-blue-500');
                saveText.textContent = 'Saved';
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    }


    


    document.addEventListener('DOMContentLoaded', function() {
        const commentLikeButtons = document.querySelectorAll('.comment-like-button');
        // alert("it work");
        commentLikeButtons.forEach(button => {
            button.addEventListener('click', async function() {
                const commentId = button.getAttribute('data-comment-id'); 
                if (!commentId) {
                    console.error('Comment ID not found on button:', button);
                    return;
                }
                
                const url = `/activities/like/${commentId}`;
    
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    // alert("it work");
                    const result = await response.json();
    
                    if (response.ok) {
                        // Update the like count and like/unlike text
                        const likeCountEl = button.querySelector('.comment-like-count');
                        const likeTextEl = button.querySelector('.comment-like-text');
    
                        likeCountEl.textContent = result.likeCount;
                        likeTextEl.textContent = result.isLiked ? 'Unlike' : 'Like';
    
                        // Toggle the "liked" class for the button
                        button.classList.toggle('liked', result.isLiked);
                    } else {
                        console.error('Error liking comment:', result.message);
                    }
                } catch (err) {
                    console.error('Network error:', err);
                }
            });
        });
    });
    
    
    