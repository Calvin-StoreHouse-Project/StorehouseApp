# StoreHouse Tools

# Usability Report

## 2021-2022 Senior Project

## Nate Minderhoud, Coleman Ulry, Jacob Williams

### Facilitated by Coleman Ulry

### Results

The usability test began on the home screen, asking the participants to login using an appropriate login that we provided. This task was straightforward, as the login functionality of the site is displayed on the home screen. No difficulties identified here.

One observation I made while observing the actions of the participants while attempting the login was that each one of them wanted to press the enter key after entering the login credentials rather than pressing the Sign In button with their mouse. As a result, I have added functionality so that on enter key presses, the Sign In button will be pressed.

After a successful login, we asked our participants to identify and route to the page where a map of the inventory space could be found. All of our participants were able to successfully route to the correct page once they saw the "Layout" menu page.

The third task consisted of adding a new item to the database, resembling a new package arriving to the StoreHouse. We provided them with all of the appropriate item information that they needed. All participants correctly navigated to "Current" page. All quickly identified the "Add Item" button, as it is clearly defined and colored on the page. Entering item information was successful. One participant asked if they _needed_ to enter something into the "Notes" textarea in order to submit the addition. A possible solution to this potential confusion is by making all fields mandatory except the notes field, and if a user attempts to add the item without all the mandatory fields entered, popup will appear. All mandatory fields will be marked with a "\*" to symbolize entry requirement.

The fourth task consisted of identifying how many boxes of Tape from Amazon the warehouse possessed. This required the user navigating to the current page and maneuvering about the page to identify the correct quantity. Surprisingly, this task gave the participants the most trouble. The table that we had designed had a height that perfectly matched the breakpoint between rows of the table. As a result, it took two of the participants between three and five seconds on the "Current" page before they realized the table was scrollable. Additionally, I had to tell one of the participants that the table was scrollable because he was not able to. To solve this problem, we have two main solutions. First, we can extend the height of the table to include a partial row, showing the user that more is below. Second, we can make sure the scroll bar stays displayed on the UI, no matter if the user is scrolling or not.

The fifth task made the participant represent the StoreHouse receiving two addition boxes to an already-carrying item. I expected this task to cause the most trouble, but it turns out, the participants were able to do so with little trouble. This is due to our team's discussion of a multi-step process for adding more boxes and ensuring that this process is straightforward.

The sixth task resembled a customer entering the StoreHouse and taking one box of an item. This is a core functional piece of the site. The participants were able to do so successfully, without any trouble.

The last task consisted of the participants finding a page where they would be able to see all of the inventory that the StoreHouse had ever received, including past and present items. They all successfully navigated using the "Archive" menu button.

## Conclusion

Overall, our participants did well in completing the tasks. The couple hick-ups we had will be resolved by implementing the solutions posed earlier. Furthermore, one participant mentioned that they would like to see a little more design, color, and uniqueness to the site, which we will attempt to do so the remaining of the semester. We desire to keep the site looking clean and clutter free, but we agree that incorporating the StoreHouse logo is certainly worthy, as well as utilizing the StoreHouse's color scheme to ensure uniformity between our site and the StoreHouse home site.
