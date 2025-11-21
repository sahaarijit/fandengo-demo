# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## HACKERRANK DEBUGGING CHALLENGE - CLONE APPLICATIONS

---

## **1. FANDANGO (MOVIE BOOKING PLATFORM)**

### **1.1 APPLICATION OVERVIEW**

A movie discovery and ticket booking platform where users browse movies, view details, manage watchlists, and book tickets. Dark theme, American English, American typography standards.

---

### **1.2 CORE FEATURES (6 Features)**

#### **Feature 1: User Authentication**

- Sign up with email/password
- Login with validation
- Logout functionality
- Session persistence across page refreshes

#### **Feature 2: Movie Catalog with Search & Filters**

- Display grid of movies with posters, titles, ratings
- Search by movie title
- Filter by: genre, rating (G, PG, PG-13, R), release year
- Sorting: alphabetical, rating (high-to-low), release date

#### **Feature 3: Movie Details Page**

- Full movie information: synopsis, cast, director, runtime, rating
- Showtimes for different theaters
- Theater location and distance display
- Trailer video embed

#### **Feature 4: Watchlist Management**

- Add movies to personal watchlist
- Remove movies from watchlist
- View all watchlisted movies on dedicated page
- Watchlist count indicator in navigation

#### **Feature 5: Top 10 Highest Rated Movies**

- Dedicated section showing top 10 movies by rating
- Auto-updates when ratings change
- Visual badge for "Top Rated"

#### **Feature 6: Ticket Booking Flow**

- Select theater, showtime, date
- Choose number of tickets
- Seat selection grid (optional: can be simplified to quantity only)
- Booking confirmation with unique booking ID
- View booking history

---

### **1.3 FRONTEND-ONLY BUGS**

#### **EASY (15 minutes) - 4 Bugs**

1. **Watchlist Button Not Toggling Visually**

   - **Bug**: Clicking "Add to Watchlist" doesn't update button text/icon from "Add" to "Remove"
   - **Expected**: Button should toggle between "Add to Watchlist" ↔ "Remove from Watchlist"
   - **Root Cause**: Missing state update in React component
   - **Fix Time**: ~3 minutes
   - **Solution**: Update the button's onClick handler to toggle the `isInWatchlist` state. Conditionally render button text/icon based on state: `{isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}`. Ensure state updates immediately after click.

2. **Movie Rating Stars Display Incorrect Count**

   - **Bug**: 4.5 rating shows 5 filled stars instead of 4.5 stars
   - **Expected**: Display accurate half-star representation
   - **Root Cause**: Math.round() instead of Math.floor() for star calculation
   - **Fix Time**: ~3 minutes
   - **Solution**: Change star calculation logic from `Math.round(rating)` to `Math.floor(rating)` for full stars. Calculate half-star by checking if `(rating % 1) >= 0.5`. Render full stars, then conditionally render half-star, then empty stars to total 5.

3. **Search Bar Clears on Every Keystroke**

   - **Bug**: Typing in search field causes input to clear after each character
   - **Expected**: Text should accumulate as user types
   - **Root Cause**: Controlled input not properly binding value to state
   - **Fix Time**: ~4 minutes
   - **Solution**: Ensure input element has `value={searchQuery}` attribute bound to state. In onChange handler, use `setSearchQuery(e.target.value)` to update state with current input value. Remove any code that resets searchQuery to empty string on change.

4. **Genre Filter Dropdown Doesn't Close After Selection**
   - **Bug**: Clicking a genre doesn't close the dropdown menu
   - **Expected**: Dropdown should close after selection
   - **Root Cause**: Missing onClick handler to toggle dropdown state
   - **Fix Time**: ~5 minutes
   - **Solution**: Add `setIsDropdownOpen(false)` inside the genre selection onClick handler. Ensure each dropdown menu item calls this function after updating the selected genre filter. The dropdown visibility should be controlled by `{isDropdownOpen && <DropdownMenu />}`.

---

#### **INTERMEDIATE (30 minutes) - 5 Bugs**

1. **Pagination Breaks When Navigating Between Pages**

   - **Bug**: Clicking page 3 shows page 2 content, page numbers out of sync
   - **Expected**: Correct page content loads, active page indicator accurate
   - **Root Cause**: Index offset error in pagination logic (zero-indexed vs one-indexed)
   - **Fix Time**: ~7 minutes
   - **Solution**: Fix the pagination calculation in the API call from `offset: currentPage * itemsPerPage` to `offset: (currentPage - 1) * itemsPerPage`. Ensure page numbers displayed start from 1, not 0. Update active page indicator to match `currentPage` state exactly.

2. **Movie Cards Overlap on Mobile Viewport**

   - **Bug**: Responsive grid breaks below 768px, cards stack incorrectly
   - **Expected**: Single column layout on mobile with proper spacing
   - **Root Cause**: CSS grid template columns not responsive, missing media queries
   - **Fix Time**: ~6 minutes
   - **Solution**: Add media query `@media (max-width: 768px)` with `grid-template-columns: 1fr;` to force single column. Add `gap: 1rem;` for spacing. Ensure existing desktop grid uses `grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));` or explicit column count.

3. **Watchlist Counter Doesn't Update After Removal**

   - **Bug**: Removing movie from watchlist doesn't decrement counter in navbar
   - **Expected**: Counter should reflect accurate watchlist count in real-time
   - **Root Cause**: State management issue—counter component not subscribed to watchlist updates
   - **Fix Time**: ~8 minutes
   - **Solution**: Lift watchlist count state to parent component or use global state (Context/Redux). When removing from watchlist, update count with `setWatchlistCount(prev => prev - 1)`. When adding, use `setWatchlistCount(prev => prev + 1)`. Ensure counter component receives updated count as prop or subscribes to state.

4. **Date Picker Allows Selecting Past Dates for Showtimes**

   - **Bug**: User can book tickets for yesterday's showtime
   - **Expected**: Only current and future dates selectable
   - **Root Cause**: Missing minDate validation on date picker component
   - **Fix Time**: ~5 minutes
   - **Solution**: Set date picker's `minDate` prop to current date: `minDate={new Date()}`. Disable all dates before today in the calendar configuration. Add validation in onChange handler to reject any date less than current date.

5. **Form Validation Errors Don't Clear After Correction**
   - **Bug**: Fixing invalid email still shows "Invalid email" error message
   - **Expected**: Error messages clear when input becomes valid
   - **Root Cause**: Error state not reset on input change event
   - **Fix Time**: ~4 minutes
   - **Solution**: In input's onChange handler, add validation check. If input becomes valid, clear error: `if (isValidEmail(value)) setEmailError(null)`. Alternatively, run validation on every change and update error state accordingly. Ensure errors object/state updates on each input change, not just on submit.

---

#### **HARD (45 minutes) - 5 Bugs**

1. **Infinite Scroll Loads Duplicate Movies**

   - **Bug**: Scrolling to bottom appends same 20 movies repeatedly
   - **Expected**: Each scroll loads next unique batch of movies
   - **Root Cause**: Pagination offset not incrementing, API call uses same page parameter
   - **Fix Time**: ~10 minutes
   - **Solution**: Maintain `page` state that increments on each scroll trigger: `setPage(prev => prev + 1)`. In useEffect that fetches data, include `page` in dependency array. API call should use `?page=${page}` or `?offset=${page * itemsPerPage}`. Append new results to existing array: `setMovies(prev => [...prev, ...newMovies])`. Add loading flag to prevent multiple simultaneous requests.

2. **React Component Re-renders Cause Performance Degradation**

   - **Bug**: Movie catalog becomes sluggish after applying filters 3-4 times
   - **Expected**: Smooth filtering with no lag
   - **Root Cause**: Missing React.memo on MovieCard component, entire list re-renders on every filter change
   - **Fix Time**: ~12 minutes
   - **Solution**: Wrap MovieCard component with `React.memo()`: `export default React.memo(MovieCard)`. Add custom comparison function if needed. Use `useCallback` for event handlers passed as props: `const handleClick = useCallback(() => {...}, [dependencies])`. Use `useMemo` for expensive computed values in parent component.

3. **State Mutation Causes Watchlist to Desync**

   - **Bug**: Adding movie to watchlist sometimes shows duplicate entries or removes wrong movie
   - **Expected**: Watchlist accurately reflects user actions
   - **Root Cause**: Direct state mutation instead of immutable update pattern
   - **Fix Time**: ~8 minutes
   - **Solution**: Replace direct mutations like `watchlist.push(movie)` with immutable updates: `setWatchlist([...watchlist, movie])`. For removal, use `setWatchlist(watchlist.filter(item => item.id !== movieId))`. Never use array methods that mutate original array (push, splice, pop) directly on state. Always create new array/object references.

4. **Conditional Rendering Breaks Seat Selection UI**

   - **Bug**: After selecting 5+ tickets, seat grid disappears and reappears randomly
   - **Expected**: Seat grid remains stable regardless of ticket count
   - **Root Cause**: Key prop missing in list rendering, React reconciliation issue
   - **Fix Time**: ~9 minutes
   - **Solution**: Add unique `key` prop to each seat element in the grid: `{seats.map(seat => <Seat key={seat.id} />)}`. Ensure keys are stable (use seat ID, not array index if order can change). If using conditional rendering, ensure parent container always renders, only content inside changes. Avoid using array index as key when list can be reordered.

5. **Race Condition in Search Debouncing**
   - **Bug**: Fast typing in search causes results from old queries to override new ones
   - **Expected**: Only the latest search query results display
   - **Root Cause**: Async API calls not cancelled, missing abort controller for previous requests
   - **Fix Time**: ~6 minutes
   - **Solution**: Create AbortController for each search request. Store controller in ref: `const abortControllerRef = useRef()`. Before new request, abort previous: `abortControllerRef.current?.abort()`. Create new controller: `abortControllerRef.current = new AbortController()`. Pass signal to fetch: `fetch(url, { signal: abortControllerRef.current.signal })`. Catch abort errors gracefully.

---

### **1.4 BACKEND-ONLY BUGS**

#### **EASY (15 minutes) - 4 Bugs**

1. **GET /movies Endpoint Returns Unsorted Data**

   - **Bug**: Movies appear in random order instead of alphabetical
   - **Expected**: Default sort by title A-Z
   - **Root Cause**: Missing ORDER BY clause in SQL query
   - **Fix Time**: ~3 minutes
   - **Solution**: Add `ORDER BY title ASC` to the SQL query: `SELECT * FROM movies WHERE status = 'active' ORDER BY title ASC`. Ensure this is the default behavior when no sort parameter is provided in the request.

2. **POST /auth/signup Doesn't Hash Password**

   - **Bug**: Passwords stored in plain text in database
   - **Expected**: Passwords hashed using bcrypt before saving
   - **Root Cause**: Missing bcrypt.hash() call in signup controller
   - **Fix Time**: ~4 minutes
   - **Solution**: Before saving user, hash password: `const hashedPassword = await bcrypt.hash(password, 10)`. Store `hashedPassword` in database instead of plain password. In login endpoint, use `bcrypt.compare(inputPassword, storedHashedPassword)` to verify. Salt rounds should be 10-12.

3. **Watchlist Endpoint Returns 500 Instead of Empty Array**

   - **Bug**: GET /watchlist crashes when user has no watchlisted movies
   - **Expected**: Return empty array with 200 status
   - **Root Cause**: Null check missing, attempting .map() on null
   - **Fix Time**: ~4 minutes
   - **Solution**: Add null check before processing results: `const watchlist = results || []`. Alternatively, initialize with empty array: `const watchlist = results?.length ? results : []`. Return `{ watchlist: watchlist || [] }` with status 200. Ensure database query returns empty array, not null, for no results.

4. **DELETE /watchlist/:id Doesn't Verify Ownership**
   - **Bug**: Any user can delete any other user's watchlist item
   - **Expected**: Only owner can delete their watchlist items
   - **Root Cause**: Missing userId validation in WHERE clause
   - **Fix Time**: ~4 minutes
   - **Solution**: Add userId to WHERE clause: `DELETE FROM watchlist WHERE id = ? AND user_id = ?`. Extract userId from authenticated session/token. Pass both id from params and userId from auth to query. Return 403 Forbidden if no rows affected (item doesn't belong to user).

---

#### **INTERMEDIATE (30 minutes) - 5 Bugs**

1. **Rating Filter Returns Wrong Movies**

   - **Bug**: Filtering for "R-rated" movies returns PG movies as well
   - **Expected**: Only R-rated movies in results
   - **Root Cause**: SQL WHERE clause uses incorrect operator (OR instead of AND)
   - **Fix Time**: ~6 minutes
   - **Solution**: Fix WHERE clause from `WHERE genre = ? OR rating = ?` to `WHERE rating = ?` for single filter. If multiple filters, use `WHERE rating = ? AND genre = ?`. Ensure each filter condition is properly ANDed. Remove any incorrect OR logic between unrelated filters.

2. **Pagination Offset Calculation Incorrect**

   - **Bug**: Page 2 starts at movie #15 instead of #21 (assuming 20 per page)
   - **Expected**: Correct offset: (page - 1) \* limit
   - **Root Cause**: Formula uses `page * limit` instead of `(page - 1) * limit`
   - **Fix Time**: ~5 minutes
   - **Solution**: Change offset calculation to: `const offset = (page - 1) * limit`. In SQL query use: `LIMIT ? OFFSET ?` with values `[limit, offset]`. Ensure page numbers start from 1, not 0. Example: page 1 = offset 0, page 2 = offset 20, page 3 = offset 40.

3. **Booking Endpoint Doesn't Check Seat Availability**

   - **Bug**: Multiple users can book the same seat for same showtime
   - **Expected**: Return error if seat already booked
   - **Root Cause**: Missing database constraint check before INSERT
   - **Fix Time**: ~8 minutes
   - **Solution**: Before INSERT, check availability: `SELECT * FROM bookings WHERE showtime_id = ? AND seat_number = ?`. If result exists, return 409 Conflict: `{ error: 'Seat already booked' }`. Add unique constraint on database: `UNIQUE(showtime_id, seat_number)`. Wrap check and insert in transaction to prevent race conditions.

4. **Search Endpoint Doesn't Escape Special Characters**

   - **Bug**: Searching for "Marvel's" breaks query syntax
   - **Expected**: Special characters handled gracefully
   - **Root Cause**: SQL injection vulnerability, not using parameterized queries
   - **Fix Time**: ~7 minutes
   - **Solution**: Use parameterized queries: `SELECT * FROM movies WHERE title LIKE ?` with parameter `['%' + searchTerm + '%']`. Never concatenate user input into SQL string. Use library's built-in escaping (e.g., `mysql.escape()` or prepared statements). Validate input to allow only alphanumeric and common punctuation.

5. **JWT Token Expiration Not Validated**
   - **Bug**: Expired tokens still grant access to protected routes
   - **Expected**: 401 Unauthorized for expired tokens
   - **Root Cause**: Missing exp claim validation in auth middleware
   - **Fix Time**: ~4 minutes
   - **Solution**: In auth middleware, decode token and check expiration: `const decoded = jwt.verify(token, SECRET)`. This automatically checks `exp` claim. If expired, catch error and return 401. Alternatively, manually check: `if (decoded.exp < Date.now() / 1000) return res.status(401).json({ error: 'Token expired' })`.

---

#### **HARD (45 minutes) - 5 Bugs**

1. **N+1 Query Problem in Movie Details Endpoint**

   - **Bug**: Loading movie details makes 50+ database queries (1 for movie + 1 per showtime)
   - **Expected**: Single optimized query with JOIN
   - **Root Cause**: Sequential queries in loop instead of JOIN with showtimes table
   - **Fix Time**: ~10 minutes
   - **Solution**: Replace loop with JOIN: `SELECT m.*, s.* FROM movies m LEFT JOIN showtimes s ON m.id = s.movie_id WHERE m.id = ?`. Group showtimes in application code or use JSON aggregation: `SELECT m.*, JSON_ARRAYAGG(JSON_OBJECT('id', s.id, 'time', s.time)) as showtimes FROM movies m LEFT JOIN showtimes s ON m.id = s.movie_id WHERE m.id = ? GROUP BY m.id`. Return single structured object.

2. **Race Condition in Seat Booking Causes Overbooking**

   - **Bug**: Two simultaneous requests can book the same seat
   - **Expected**: Second request should fail with "Seat unavailable"
   - **Root Cause**: No transaction locking, missing SELECT FOR UPDATE
   - **Fix Time**: ~12 minutes
   - **Solution**: Wrap booking in transaction with row locking: `BEGIN TRANSACTION; SELECT * FROM seats WHERE id = ? AND showtime_id = ? FOR UPDATE; INSERT INTO bookings ...; COMMIT;`. The `FOR UPDATE` locks the row until transaction completes. Second concurrent request waits, then fails if seat already booked. Add timeout for lock acquisition.

3. **Memory Leak in Watchlist Aggregation**

   - **Bug**: Server memory increases continuously when multiple users access watchlist
   - **Expected**: Stable memory usage
   - **Root Cause**: Database connection not closed in error cases, connection pool exhaustion
   - **Fix Time**: ~9 minutes
   - **Solution**: Ensure connections closed in try/finally block: `try { const result = await query() } finally { connection.release() }`. Use connection pooling properly. Avoid creating new connections per request. Use library's built-in connection management. Set pool limits: `{ connectionLimit: 10 }`. Always release connections after use, even on errors.

4. **Incorrect Aggregation in Top 10 Rated Movies**

   - **Bug**: Movies with same rating don't appear in deterministic order
   - **Expected**: Secondary sort by title when ratings equal
   - **Root Cause**: SQL query missing secondary ORDER BY clause
   - **Fix Time**: ~7 minutes
   - **Solution**: Add secondary sort: `ORDER BY rating DESC, title ASC LIMIT 10`. This ensures that when two movies have same rating (e.g., both 4.5), they're sorted alphabetically by title. Can also add tertiary sort by release date: `ORDER BY rating DESC, title ASC, release_date DESC`.

5. **Time Zone Bug in Showtime Filtering**
   - **Bug**: Showtimes before current time still appear for "today"
   - **Expected**: Only future showtimes for current day
   - **Root Cause**: Server uses UTC, comparison doesn't account for user timezone
   - **Fix Time**: ~7 minutes
   - **Solution**: Accept user timezone in request (e.g., header or query param). Convert current time to user's timezone: `const userNow = moment().tz(userTimezone)`. Filter showtimes: `WHERE showtime_datetime > ?` with user's local time converted to UTC for storage/comparison. Store all times in UTC, convert to user timezone for display. Use libraries like moment-timezone or date-fns-tz.

---

### **1.5 FULL-STACK BUGS**

#### **EASY (15 minutes) - 4 Bugs**

1. **Watchlist Add/Remove Not Persisting**

   - **Bug**: Adding movie to watchlist works, but refreshing page removes it
   - **Frontend Issue**: Optimistic update not syncing with backend response
   - **Backend Issue**: POST endpoint returns success but doesn't save to database
   - **Fix Time**: ~4 minutes
   - **Solution**:
     - **Backend**: Ensure INSERT query executes: `await db.query('INSERT INTO watchlist (user_id, movie_id) VALUES (?, ?)', [userId, movieId])`. Return inserted item with ID.
     - **Frontend**: After API success, update state with response data: `setWatchlist([...watchlist, response.data])`. On page load, fetch from server: `useEffect(() => { fetchWatchlist() }, [])`.

2. **Movie Search Returns Results But UI Shows "No Results"**

   - **Bug**: Backend returns correct data, frontend displays empty state
   - **Frontend Issue**: Conditional rendering checks wrong property (data.movies vs data.results)
   - **Backend Issue**: Response structure inconsistent (sometimes "movies", sometimes "results")
   - **Fix Time**: ~4 minutes
   - **Solution**:
     - **Backend**: Standardize response structure to always use `{ movies: [...] }` or `{ results: [...] }`. Document this in API spec.
     - **Frontend**: Update conditional check to match: `{data.movies?.length === 0 ? <NoResults /> : <MovieList movies={data.movies} />}`. Or destructure correctly: `const { movies = [] } = data`.

3. **Login Successful But User Redirected to Error Page**

   - **Bug**: Backend returns 200 with token, frontend treats as failure
   - **Frontend Issue**: Success handler checking for wrong status code (201 instead of 200)
   - **Backend Issue**: Returns 200 instead of documented 201
   - **Fix Time**: ~4 minutes
   - **Solution**:
     - **Backend**: Change status code to 201: `res.status(201).json({ token, user })` to match documentation. Or update docs to reflect 200.
     - **Frontend**: Update success condition: `if (response.status === 200 || response.status === 201)` or simply check for success range: `if (response.ok)` or `if (response.status >= 200 && response.status < 300)`.

4. **Booking Confirmation Shows Wrong Theater Name**
   - **Bug**: Booked "AMC Downtown", confirmation says "Cinemark Uptown"
   - **Frontend Issue**: Displaying theater ID instead of theater name
   - **Backend Issue**: Response doesn't include theater object, only theaterId
   - **Fix Time**: ~3 minutes
   - **Solution**:
     - **Backend**: JOIN with theaters table: `SELECT b.*, t.name as theater_name FROM bookings b JOIN theaters t ON b.theater_id = t.id`. Return `{ booking: { ..., theater: { id, name } } }`.
     - **Frontend**: Display correct property: Change `{booking.theaterId}` to `{booking.theater.name}` or `{booking.theater_name}`.

---

#### **INTERMEDIATE (30 minutes) - 5 Bugs**

1. **Filter Applied But Results Don't Update**

   - **Bug**: Selecting "Action" genre doesn't filter movies
   - **Frontend Issue**: Query params not appended to API request URL
   - **Backend Issue**: Endpoint ignores query params, always returns full catalog
   - **Fix Time**: ~7 minutes
   - **Solution**:
     - **Frontend**: Append filters to URL: `fetch(\`/api/movies?genre=${selectedGenre}&rating=${selectedRating}\`)`. Update useEffect dependency: `useEffect(() => { fetchMovies() }, [selectedGenre, selectedRating])`.
     - **Backend**: Parse query params: `const { genre, rating } = req.query`. Build dynamic WHERE clause: `let conditions = []; if (genre) conditions.push(\`genre = '\${genre}'\`); const whereClause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''`. Use parameterized queries for safety.

2. **Pagination Shows Wrong Total Page Count**

   - **Bug**: Backend says 150 total movies, frontend calculates 50 pages (should be 8 at 20/page)
   - **Frontend Issue**: Math.round() instead of Math.ceil() for page calculation
   - **Backend Issue**: Returns total count of all movies, not filtered count
   - **Fix Time**: ~6 minutes
   - **Solution**:
     - **Frontend**: Change to `Math.ceil(totalCount / itemsPerPage)`: `const totalPages = Math.ceil(150 / 20) // = 8`.
     - **Backend**: Return filtered count: `SELECT COUNT(*) as total FROM movies WHERE genre = ?`. Not total table count. Include in response: `{ movies: [...], totalCount: count, page, limit }`.

3. **Watchlist Counter Out of Sync After Deletion**

   - **Bug**: Removing movie decrements counter to -1 or doesn't update
   - **Frontend Issue**: Counter decrements before API call completes (fails silently)
   - **Backend Issue**: DELETE endpoint returns 204 with no body, frontend expects updated count
   - **Fix Time**: ~8 minutes
   - **Solution**:
     - **Frontend**: Wait for API response before updating: `await removeFromWatchlist(id); setWatchlistCount(prev => prev - 1)`. Or, on error, revert: `setWatchlistCount(prev => prev + 1)`.
     - **Backend**: Return updated count: `res.status(200).json({ message: 'Removed', count: newCount })` instead of 204. After delete, query count: `SELECT COUNT(*) FROM watchlist WHERE user_id = ?`.

4. **Date Picker Selection Doesn't Match Backend Showtime Filter**

   - **Bug**: Selecting "Nov 20" shows Nov 19 showtimes
   - **Frontend Issue**: Sends date in local timezone
   - **Backend Issue**: Parses date as UTC, off by timezone offset
   - **Fix Time**: ~6 minutes
   - **Solution**:
     - **Frontend**: Send date in ISO 8601 format with timezone: `selectedDate.toISOString()` or send as UTC: `selectedDate.toISOString().split('T')[0]` for date-only.
     - **Backend**: Parse date respecting timezone: `const date = new Date(req.query.date)`. Or, accept date as string and compare with DATE SQL function: `WHERE DATE(showtime_datetime) = ?`. Standardize on UTC storage.

5. **Search Debouncing Causes Mismatched Results**
   - **Bug**: Typing "Avengers" quickly shows results for "Ave"
   - **Frontend Issue**: Debounce triggers API call before user finishes typing
   - **Backend Issue**: Slow response time (3s), old results arrive after new ones
   - **Fix Time**: ~3 minutes
   - **Solution**:
     - **Frontend**: Increase debounce delay to 500ms: `debounce(handleSearch, 500)`. Use AbortController to cancel previous requests (see Hard bug #5 solution).
     - **Backend**: Optimize query performance: Add index on title column: `CREATE INDEX idx_title ON movies(title)`. Use LIKE with leading wildcard only on right side: `WHERE title LIKE 'Ave%'` (faster than `WHERE title LIKE '%Ave%'`).

---

#### **HARD (45 minutes) - 5 Bugs**

1. **Seat Selection Desyncs Between Users**

   - **Bug**: User A selects seat 12, User B also sees it available and books it
   - **Frontend Issue**: No WebSocket or polling for real-time seat status
   - **Backend Issue**: No locking mechanism, optimistic concurrency not implemented
   - **Fix Time**: ~12 minutes
   - **Solution**:
     - **Frontend**: Implement polling every 5 seconds: `setInterval(() => fetchSeatStatus(), 5000)`. Or use WebSocket: `ws.on('seat-booked', (seatId) => updateSeatStatus(seatId))`. Disable booked seats in UI immediately.
     - **Backend**: Use transaction with SELECT FOR UPDATE (see Backend Hard bug #2). Emit WebSocket event on booking: `io.emit('seat-booked', { showtimeId, seatId })`. Add unique constraint on (showtime_id, seat_number).

2. **Authentication State Inconsistent After Token Refresh**

   - **Bug**: User logged in, token refreshes, UI shows logged out state randomly
   - **Frontend Issue**: Interceptor replaces old token but doesn't re-trigger failed requests
   - **Backend Issue**: Refresh token endpoint returns new token but invalidates old one mid-request
   - **Fix Time**: ~10 minutes
   - **Solution**:
     - **Frontend**: In axios interceptor, retry failed request with new token: `const response = await axios.request(originalRequest)`. Queue failed requests during refresh, replay after new token obtained. Use a refresh flag to prevent multiple simultaneous refresh calls.
     - **Backend**: Don't invalidate old token immediately. Keep both old and new token valid for grace period (e.g., 1 minute). Or, use rotating refresh tokens with family tracking to detect token theft.

3. **Infinite Scroll Fetches Wrong Data After Filter Applied**

   - **Bug**: Filter by "Comedy", scroll down, next batch includes "Horror" movies
   - **Frontend Issue**: Scroll handler doesn't include current filter state in API call
   - **Backend Issue**: Pagination endpoint stateless, doesn't remember previous filter context
   - **Fix Time**: ~9 minutes
   - **Solution**:
     - **Frontend**: Include all active filters in each request: `fetch(\`/api/movies?page=\${page}&genre=\${genre}&rating=\${rating}\`)`. Store filters in state and include in API call dependencies.
     - **Backend**: Parse and apply ALL query params on every request: `const { page, genre, rating } = req.query`. Build WHERE clause with all filters. Backend should be stateless - client sends complete filter state each time.

4. **Watchlist Sync Issue Across Browser Tabs**

   - **Bug**: Add movie in Tab 1, Tab 2 doesn't reflect change until manual refresh
   - **Frontend Issue**: No shared state management (localStorage events not listened)
   - **Backend Issue**: No push mechanism for state changes
   - **Fix Time**: ~8 minutes
   - **Solution**:
     - **Frontend**: Use localStorage events: `window.addEventListener('storage', (e) => { if (e.key === 'watchlist') setWatchlist(JSON.parse(e.newValue)) })`. When updating watchlist, update localStorage: `localStorage.setItem('watchlist', JSON.stringify(newWatchlist))`. Or use BroadcastChannel API: `const bc = new BroadcastChannel('watchlist'); bc.postMessage({ action: 'add', movieId })`.
     - **Backend**: Not required for this solution, but could implement Server-Sent Events (SSE) or WebSocket for real-time push.

5. **Movie Rating Update Doesn't Reflect in Top 10 List**
   - **Bug**: Movie rating changes from 4.2 to 4.8, doesn't appear in Top 10 list
   - **Frontend Issue**: Top 10 component doesn't re-fetch after rating update
   - **Backend Issue**: Caching layer serves stale Top 10 data for 1 hour
   - **Fix Time**: ~6 minutes
   - **Solution**:
     - **Frontend**: Invalidate Top 10 query after rating update: `queryClient.invalidateQueries('top10')`. Or add rating update timestamp to dependency array: `useEffect(() => { fetchTop10() }, [lastRatingUpdate])`.
     - **Backend**: Reduce cache TTL for Top 10 endpoint to 5 minutes. Or, invalidate cache on rating change: `redis.del('top10-movies')` after UPDATE ratings query. Implement cache busting strategy.

---

## **2. AIRBNB (PROPERTY RENTAL PLATFORM)**

### **2.1 APPLICATION OVERVIEW**

A short-term property rental platform where users search for accommodations, view property details, manage wishlists, and book stays. Dark theme, American English, American typography standards.

---

### **2.2 CORE FEATURES (6 Features)**

#### **Feature 1: User Authentication**

- Sign up with email/password
- Login with validation
- Logout functionality
- Profile page with user details

#### **Feature 2: Property Search with Filters**

- Search by location (city, neighborhood)
- Filter by: price range, property type (apartment, house, villa), number of guests, amenities (WiFi, pool, parking)
- Date range picker for check-in/check-out
- Map view showing property locations

#### **Feature 3: Property Listing Grid**

- Display properties with images, title, price per night, rating
- Pagination or infinite scroll
- Sorting: price (low-to-high, high-to-low), rating

#### **Feature 4: Property Details Page**

- Full property description
- Photo gallery (5-10 images)
- Host information
- Amenities list
- Location map
- Reviews section (read-only for simplicity)
- Availability calendar

#### **Feature 5: Wishlist Management**

- Add properties to wishlist
- Remove from wishlist
- View all wishlisted properties
- Wishlist count in navigation

#### **Feature 6: Booking Flow**

- Select check-in/check-out dates
- Guest count selection
- Price breakdown (nights × price + cleaning fee + service fee)
- Booking confirmation with reservation ID
- View booking history

---

### **2.3 FRONTEND-ONLY BUGS**

#### **EASY (15 minutes) - 4 Bugs**

1. **Wishlist Heart Icon Doesn't Toggle Color**

   - **Bug**: Clicking heart icon doesn't change from outline to filled
   - **Expected**: Visual feedback on wishlist add/remove
   - **Root Cause**: CSS class not toggling based on state
   - **Fix Time**: ~3 minutes
   - **Solution**: Toggle CSS class based on state: `className={isWishlisted ? 'heart-filled' : 'heart-outline'}`. Or use conditional icon component: `{isWishlisted ? <HeartFilledIcon /> : <HeartOutlineIcon />}`. Ensure state updates on click: `setIsWishlisted(!isWishlisted)`.

2. **Price Display Shows NaN for Some Properties**

   - **Bug**: Some property cards show "$NaN/night"
   - **Expected**: Actual price displayed
   - **Root Cause**: parseInt() on string with currency symbol, should strip "$" first
   - **Fix Time**: ~4 minutes
   - **Solution**: Strip currency symbol before parsing: `const price = parseInt(priceString.replace(/[$,]/g, ''))`. Or use parseFloat for decimals: `parseFloat(priceString.replace(/[^0-9.]/g, ''))`. Add fallback: `const price = parseInt(priceString) || 0`. Display with formatting: `{isNaN(price) ? 'N/A' : \`$\${price}/night\`}`.

3. **Guest Counter Allows Negative Values**

   - **Bug**: Clicking decrement button reduces guest count to -1, -2
   - **Expected**: Minimum value should be 1
   - **Root Cause**: Missing min value validation on decrement handler
   - **Fix Time**: ~3 minutes
   - **Solution**: Add validation in decrement handler: `const handleDecrement = () => setGuestCount(prev => Math.max(1, prev - 1))`. Or conditional: `if (guestCount > 1) setGuestCount(prev => prev - 1)`. Disable decrement button when at minimum: `disabled={guestCount <= 1}`.

4. **Date Picker Calendar Doesn't Highlight Selected Dates**
   - **Bug**: Selected check-in/check-out dates not visually highlighted
   - **Expected**: Selected date range shows distinct background color
   - **Root Cause**: Active date CSS class not applied
   - **Fix Time**: ~5 minutes
   - **Solution**: Add conditional class to date elements: `className={isDateInRange(date) ? 'date-selected' : 'date-default'}`. Define CSS: `.date-selected { background-color: #007bff; color: white; }`. Ensure date comparison function checks if date is between checkIn and checkOut.

---

#### **INTERMEDIATE (30 minutes) - 5 Bugs**

1. **Property Card Image Carousel Breaks After 3 Clicks**

   - **Bug**: Clicking "next" more than 3 times shows blank image
   - **Expected**: Carousel loops back to first image after last
   - **Root Cause**: Index goes out of bounds, needs modulo operator
   - **Fix Time**: ~6 minutes
   - **Solution**: Use modulo to wrap index: `const handleNext = () => setCurrentIndex((currentIndex + 1) % images.length)`. For previous: `setCurrentIndex((currentIndex - 1 + images.length) % images.length)`. This ensures index stays within 0 to images.length-1.

2. **Filter Panel Doesn't Reset After Applying**

   - **Bug**: Clearing filters still shows previous filter chips, properties remain filtered
   - **Expected**: "Clear All" button resets filter state and shows all properties
   - **Root Cause**: Reset function doesn't update all filter state variables
   - **Fix Time**: ~7 minutes
   - **Solution**: Create comprehensive reset function: `const resetFilters = () => { setPriceRange([0, 1000]); setPropertyType(null); setGuests(1); setAmenities([]); setLocation(''); }`. Call on "Clear All" click. Re-fetch properties with empty filters. Ensure all filter state variables are reset to initial values.

3. **Price Range Slider Thumb Positions Swap Incorrectly**

   - **Bug**: Dragging min-price slider past max-price causes values to invert
   - **Expected**: Min slider stops at max value, or values auto-correct
   - **Root Cause**: No boundary validation between min/max slider values
   - **Fix Time**: ~8 minutes
   - **Solution**: Add validation in onChange: `const handleMinChange = (value) => setMinPrice(Math.min(value, maxPrice - 10))`. For max: `const handleMaxChange = (value) => setMaxPrice(Math.max(value, minPrice + 10))`. Ensure min is always less than max with minimum gap (e.g., $10).

4. **Property Grid Layout Breaks on Tablet Viewport**

   - **Bug**: 3-column grid on desktop, but on tablet (768px-1024px) shows single column
   - **Expected**: 2-column grid on tablet
   - **Root Cause**: Missing media query breakpoint for tablet
   - **Fix Time**: ~5 minutes
   - **Solution**: Add tablet media query: `@media (min-width: 768px) and (max-width: 1024px) { .property-grid { grid-template-columns: repeat(2, 1fr); } }`. Ensure desktop query is `@media (min-width: 1025px) { grid-template-columns: repeat(3, 1fr); }`. Mobile stays single column.

5. **Booking Summary Doesn't Update When Dates Change**
   - **Bug**: Changing check-out date doesn't recalculate total nights and price
   - **Expected**: Total updates in real-time as dates change
   - **Root Cause**: useEffect dependency array missing date state variables
   - **Fix Time**: ~4 minutes
   - **Solution**: Add dates to useEffect dependencies: `useEffect(() => { const nights = calculateNights(checkIn, checkOut); const total = nights * pricePerNight; setTotalPrice(total); }, [checkIn, checkOut, pricePerNight])`. Ensure calculation function is called whenever dates change.

---

#### **HARD (45 minutes) - 5 Bugs**

1. **Map Markers Don't Sync with Filtered Properties**

   - **Bug**: Applying filter shows 5 properties in list, but map shows all 50 markers
   - **Expected**: Map markers match filtered property list
   - **Root Cause**: Map component not re-rendering when filter state updates
   - **Fix Time**: ~10 minutes
   - **Solution**: Pass filtered properties to map component: `<Map properties={filteredProperties} />`. In map component, clear and re-add markers when properties prop changes: `useEffect(() => { clearMarkers(); properties.forEach(p => addMarker(p)); }, [properties])`. Ensure map reference is stable and only markers update.

2. **Memory Leak in Property Image Preloader**

   - **Bug**: Browsing 20+ properties causes browser to slow down significantly
   - **Expected**: Smooth performance regardless of properties viewed
   - **Root Cause**: Image preloading creates new Image() objects without cleanup
   - **Fix Time**: ~12 minutes
   - **Solution**: Store image refs and cleanup in useEffect: `useEffect(() => { const imgs = images.map(src => { const img = new Image(); img.src = src; return img; }); return () => { imgs.forEach(img => img.src = ''); }; }, [images])`. Or use native lazy loading: `<img loading="lazy" />`. Limit preloading to visible/next images only.

3. **Optimistic UI Update Causes Duplicate Wishlist Entries**

   - **Bug**: Quick double-click on wishlist button shows property twice in wishlist
   - **Expected**: Property appears once, subsequent clicks remove it
   - **Root Cause**: Optimistic update adds item before API response, response adds again
   - **Fix Time**: ~8 minutes
   - **Solution**: Add loading state to prevent double-click: `const [isAdding, setIsAdding] = useState(false); if (isAdding) return;`. Or check if already in wishlist: `if (wishlist.find(item => item.id === propertyId)) return;`. Remove optimistic update or ensure response doesn't re-add: Update state only from response, not optimistically.

4. **Infinite Scroll Triggers Multiple API Calls Simultaneously**

   - **Bug**: Scrolling to bottom fires 3-4 API requests at once
   - **Expected**: One request at a time, next fires only after previous completes
   - **Root Cause**: No loading flag to prevent concurrent requests
   - **Fix Time**: ~9 minutes
   - **Solution**: Add loading flag: `const [isLoading, setIsLoading] = useState(false); if (isLoading) return;`. In scroll handler: `if (isLoading || !hasMore) return; setIsLoading(true); await fetchMore(); setIsLoading(false);`. Add debouncing to scroll event: `debounce(handleScroll, 200)`.

5. **Date Range Selection Allows Check-Out Before Check-In**
   - **Bug**: User can select check-out date earlier than check-in date
   - **Expected**: Validation prevents illogical date ranges
   - **Root Cause**: Date comparison logic missing in onChange handlers
   - **Fix Time**: ~6 minutes
   - **Solution**: Validate in onChange: `const handleCheckOutChange = (date) => { if (date <= checkIn) { alert('Check-out must be after check-in'); return; } setCheckOut(date); }`. Or auto-adjust: `if (date <= checkIn) setCheckOut(addDays(checkIn, 1))`. Disable dates in picker: `minDate={addDays(checkIn, 1)}` for check-out picker.

---

### **2.4 BACKEND-ONLY BUGS**

#### **EASY (15 minutes) - 4 Bugs**

1. **GET /properties Returns Inactive Listings**

   - **Bug**: Properties marked as "inactive" still appear in search results
   - **Expected**: Only active properties returned
   - **Root Cause**: Missing WHERE status = 'active' in SQL query
   - **Fix Time**: ~3 minutes
   - **Solution**: Add status filter to query: `SELECT * FROM properties WHERE status = 'active' ORDER BY created_at DESC`. Ensure all property endpoints include this filter. Add database index on status column for performance.

2. **POST /bookings Doesn't Validate Date Overlap**

   - **Bug**: Can book property for Nov 15-20 even if already booked Nov 18-22
   - **Expected**: Error returned for overlapping bookings
   - **Root Cause**: No date range conflict check before INSERT
   - **Fix Time**: ~4 minutes
   - **Solution**: Check for overlaps before insert: `SELECT * FROM bookings WHERE property_id = ? AND ((check_in <= ? AND check_out >= ?) OR (check_in <= ? AND check_out >= ?))` with params [propertyId, newCheckIn, newCheckIn, newCheckOut, newCheckOut]. If result exists, return 409: `{ error: 'Property not available for selected dates' }`.

3. **Wishlist Endpoint Returns Other Users' Wishlists**

   - **Bug**: GET /wishlist returns all users' wishlist items
   - **Expected**: Only current user's wishlist
   - **Root Cause**: Missing userId filter in WHERE clause
   - **Fix Time**: ~4 minutes
   - **Solution**: Add user filter: `SELECT w.*, p.* FROM wishlist w JOIN properties p ON w.property_id = p.id WHERE w.user_id = ?`. Extract userId from authenticated session/JWT token. Never accept userId from request body/params - always use authenticated user.

4. **Price Calculation Doesn't Include Service Fee**
   - **Bug**: Total price shows $500 (5 nights × $100), but should be $575 (includes 15% fee)
   - **Expected**: Total includes base price + cleaning fee + service fee
   - **Root Cause**: Calculation formula missing service fee addition
   - **Fix Time**: ~3 minutes
   - **Solution**: Complete calculation: `const subtotal = nights * pricePerNight; const serviceFee = subtotal * 0.15; const total = subtotal + cleaningFee + serviceFee;`. Return breakdown: `{ subtotal, cleaningFee, serviceFee, total }`. Document fee structure in API response.

---

#### **INTERMEDIATE (30 minutes) - 6 Bugs**

1. **Property Search Ignores Guest Count Filter**

   - **Bug**: Searching for 6 guests returns properties with max capacity of 4
   - **Expected**: Only properties with capacity ≥ guest count
   - **Root Cause**: SQL WHERE clause missing capacity comparison
   - **Fix Time**: ~5 minutes
   - **Solution**: Add capacity filter: `SELECT * FROM properties WHERE max_guests >= ? AND status = 'active'`. Parse guest count from query params: `const guests = parseInt(req.query.guests) || 1`. Include in WHERE clause with other filters.

2. **Price Range Filter Uses OR Instead of AND**

   - **Bug**: Filter $100-$200 returns properties at $50 OR $250
   - **Expected**: Only properties within $100-$200 range
   - **Root Cause**: WHERE price >= min OR price <= max (should be AND)
   - **Fix Time**: ~6 minutes
   - **Solution**: Fix to AND logic: `WHERE price_per_night >= ? AND price_per_night <= ?` with params [minPrice, maxPrice]. Ensure both conditions must be true. Example: `WHERE price_per_night BETWEEN ? AND ?` is equivalent and cleaner.

3. **Pagination Returns Duplicate Properties on Page 2**

   - **Bug**: Page 1 shows Property A, Page 2 also shows Property A
   - **Expected**: Unique properties per page
   - **Root Cause**: No ORDER BY clause, database returns random order
   - **Fix Time**: ~7 minutes
   - **Solution**: Add consistent ORDER BY: `ORDER BY id ASC LIMIT ? OFFSET ?` or `ORDER BY created_at DESC, id ASC`. The secondary id sort ensures deterministic order even when created_at values are same. Apply before LIMIT/OFFSET.

4. **Booking Confirmation Email Contains Wrong Dates**

   - **Bug**: Booked Nov 15-20, email says Nov 15-19
   - **Expected**: Email matches booking dates exactly
   - **Root Cause**: Date calculation excludes check-out date (off-by-one error)
   - **Fix Time**: ~5 minutes
   - **Solution**: Include check-out date in email template. Fix date range calculation: `const nights = differenceInDays(checkOut, checkIn)`. Template should show: "Check-in: Nov 15, Check-out: Nov 20 (5 nights)". Ensure checkOut is inclusive in display but exclusive in night calculation.

5. **Amenities Filter Returns Properties with ANY Amenity Instead of ALL**

   - **Bug**: Filter for "WiFi + Pool", returns properties with only WiFi
   - **Expected**: Properties must have ALL selected amenities
   - **Root Cause**: SQL uses OR between amenities instead of AND (or incorrect JOIN logic)
   - **Fix Time**: ~7 minutes
   - **Solution**: Use GROUP BY with HAVING: `SELECT p.* FROM properties p JOIN property_amenities pa ON p.id = pa.property_id WHERE pa.amenity_id IN (?, ?) GROUP BY p.id HAVING COUNT(DISTINCT pa.amenity_id) = ?` where ? is count of selected amenities. This ensures property has all specified amenities.

6. **GET /properties/:id Includes Deleted Reviews**
   - **Bug**: Property details show reviews marked as deleted
   - **Expected**: Only active reviews displayed
   - **Root Cause**: JOIN doesn't filter reviews.status = 'active'
   - **Fix Time**: ~4 minutes
   - **Solution**: Add status filter to JOIN: `SELECT p.*, r.* FROM properties p LEFT JOIN reviews r ON p.id = r.property_id AND r.status = 'active' WHERE p.id = ?`. Or filter in WHERE: `WHERE p.id = ? AND (r.status = 'active' OR r.id IS NULL)`.

---

#### **HARD (45 minutes) - 5 Bugs**

1. **Race Condition Allows Double Booking**

   - **Bug**: Two users simultaneously book same property for same dates
   - **Expected**: Second booking request fails with "Property unavailable"
   - **Root Cause**: No database transaction locking (SELECT FOR UPDATE missing)
   - **Fix Time**: ~12 minutes
   - **Solution**: Use transaction with row locking: `BEGIN; SELECT * FROM properties WHERE id = ? FOR UPDATE; SELECT * FROM bookings WHERE property_id = ? AND (check_in <= ? AND check_out >= ?) FOR UPDATE; INSERT INTO bookings ...; COMMIT;`. The FOR UPDATE locks rows until commit. Second concurrent request waits and fails if dates overlap. Set transaction isolation level to REPEATABLE READ.

2. **N+1 Query in Property Listing Endpoint**

   - **Bug**: Loading 20 properties makes 41 queries (1 main + 20 for amenities + 20 for reviews)
   - **Expected**: Optimized query with JOINs, max 3 queries
   - **Root Cause**: Sequential queries in loop for each property's relations
   - **Fix Time**: ~10 minutes
   - **Solution**: Use JOINs with JSON aggregation: `SELECT p.*, JSON_ARRAYAGG(JSON_OBJECT('id', a.id, 'name', a.name)) as amenities, AVG(r.rating) as avg_rating FROM properties p LEFT JOIN property_amenities pa ON p.id = pa.property_id LEFT JOIN amenities a ON pa.amenity_id = a.id LEFT JOIN reviews r ON p.id = r.property_id GROUP BY p.id`. Or use separate optimized queries with IN clause: `SELECT * FROM amenities WHERE property_id IN (?)`.

3. **Location Search Uses String Matching Instead of Geospatial Query**

   - **Bug**: Searching "San Francisco" returns properties in "San Diego" and "San Jose"
   - **Expected**: Precise city-based filtering
   - **Root Cause**: SQL uses LIKE '%San%' instead of exact city match or geospatial bounding box
   - **Fix Time**: ~9 minutes
   - **Solution**: Use exact match on city: `WHERE city = ?` or case-insensitive: `WHERE LOWER(city) = LOWER(?)`. For fuzzy search, use full-text search: `WHERE MATCH(city, neighborhood) AGAINST(?)`. For geospatial, use PostGIS: `WHERE ST_DWithin(location, ST_MakePoint(?, ?), ?)` with lat/lng radius. Add index on city column.

4. **Booking Cancellation Doesn't Refund Correctly Based on Policy**

   - **Bug**: Cancelling 10 days before check-in refunds 50% (should be 100% per policy)
   - **Expected**: Refund calculation follows cancellation policy rules
   - **Root Cause**: Date difference calculation incorrect, business logic not implemented
   - **Fix Time**: ~8 minutes
   - **Solution**: Implement policy logic: `const daysUntilCheckIn = differenceInDays(checkIn, new Date()); let refundPercent; if (daysUntilCheckIn >= 14) refundPercent = 100; else if (daysUntilCheckIn >= 7) refundPercent = 50; else refundPercent = 0; const refundAmount = totalPrice * (refundPercent / 100);`. Store policy rules in database for flexibility. Apply correct calculation before processing refund.

5. **Average Rating Calculation Includes Unverified Reviews**
   - **Bug**: Property rating 4.5, but includes fake/spam reviews (should be 4.8 with verified only)
   - **Expected**: Rating aggregates only verified reviews
   - **Root Cause**: AVG() calculation doesn't filter by review.verified = true
   - **Fix Time**: ~6 minutes
   - **Solution**: Filter in aggregation: `SELECT AVG(rating) as avg_rating FROM reviews WHERE property_id = ? AND verified = true AND status = 'active'`. Update property display query: `LEFT JOIN (SELECT property_id, AVG(rating) as avg_rating FROM reviews WHERE verified = true GROUP BY property_id) r ON p.id = r.property_id`.

---

### **2.5 FULL-STACK BUGS**

#### **EASY (15 minutes) - 4 Bugs**

1. **Wishlist Add Button Shows Success But Item Doesn't Persist**

   - **Bug**: Adding property to wishlist works, refresh removes it
   - **Frontend Issue**: Optimistic UI update not rolled back on API failure
   - **Backend Issue**: POST returns 200 but database INSERT fails silently
   - **Fix Time**: ~4 minutes
   - **Solution**:
     - **Backend**: Add error handling: `try { await db.query('INSERT INTO wishlist...'); res.json({ success: true }); } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to add' }); }`. Check for duplicate key errors.
     - **Frontend**: Handle errors: `try { await addToWishlist(); setWishlist([...wishlist, property]); } catch { setWishlist(wishlist); // rollback alert('Failed to add'); }`. Or fetch from server on page load to sync: `useEffect(() => { fetchWishlist() }, [])`.

2. **Property Search Shows Results But Count Says "0 Properties Found"**

   - **Bug**: 15 properties displayed, header says "0 properties found"
   - **Frontend Issue**: Reading totalCount from wrong response property
   - **Backend Issue**: Response has "total" instead of "totalCount"
   - **Fix Time**: ~3 minutes
   - **Solution**:
     - **Backend**: Standardize response: `res.json({ properties: [...], totalCount: count })` (not "total").
     - **Frontend**: Read correct property: `const { properties, totalCount } = response.data; <h2>{totalCount} properties found</h2>`. Or use destructuring with default: `const { totalCount = 0 } = response.data`.

3. **Booking Total Price Mismatch**

   - **Bug**: Frontend shows $575, backend confirms booking at $500
   - **Frontend Issue**: Adds 15% service fee in calculation
   - **Backend Issue**: Doesn't add service fee, only base price + cleaning fee
   - **Fix Time**: ~4 minutes
   - **Solution**:
     - **Backend**: Add service fee to calculation: `const serviceFee = subtotal * 0.15; const total = subtotal + cleaningFee + serviceFee`. Return: `{ subtotal, cleaningFee, serviceFee, total }`.
     - **Frontend**: Use backend-calculated total: `const { total } = response.data; setTotalPrice(total)`. Don't calculate locally, trust backend calculation as source of truth.

4. **Login Redirects to Dashboard But User Data Not Loaded**
   - **Bug**: After login, dashboard shows "Welcome, undefined"
   - **Frontend Issue**: Accesses user.name before API call completes
   - **Backend Issue**: Token endpoint doesn't return user object, only token
   - **Fix Time**: ~4 minutes
   - **Solution**:
     - **Backend**: Include user in response: `res.json({ token, user: { id, name, email } })`. Or create separate /me endpoint.
     - **Frontend**: Wait for user data: `const { token, user } = await login(); setUser(user); navigate('/dashboard')`. Or fetch user after login: `setToken(token); await fetchUser(); navigate('/dashboard')`.

---

#### **INTERMEDIATE (30 minutes) - 5 Bugs**

1. **Date Filter Applied But All Properties Still Show**

   - **Bug**: Selecting Nov 20-25 doesn't filter unavailable properties
   - **Frontend Issue**: Date params sent as strings "Nov 20" instead of ISO format
   - **Backend Issue**: Endpoint expects ISO format, string parsing fails silently
   - **Fix Time**: ~7 minutes
   - **Solution**:
     - **Frontend**: Convert to ISO: `const checkInISO = checkIn.toISOString(); fetch(\`/api/properties?checkIn=\${checkInISO}&checkOut=\${checkOutISO}\`)`. Or use date-only format: `checkIn.toISOString().split('T')[0]`.
     - **Backend**: Parse dates safely: `const checkIn = new Date(req.query.checkIn); if (isNaN(checkIn)) return res.status(400).json({ error: 'Invalid date' })`. Use in query: `WHERE NOT EXISTS (SELECT 1 FROM bookings WHERE property_id = p.id AND check_in < ? AND check_out > ?)`.

2. **Guest Count Filter Works But Pagination Breaks**

   - **Bug**: Filter for 6 guests shows page 1 correctly, page 2 shows 2-guest properties
   - **Frontend Issue**: Pagination request doesn't include filter params
   - **Backend Issue**: Stateless endpoint doesn't remember previous filter context
   - **Fix Time**: ~8 minutes
   - **Solution**:
     - **Frontend**: Include filters in pagination URL: `fetch(\`/api/properties?page=\${page}&guests=\${guests}&minPrice=\${minPrice}\`)`. Store filters in state and pass to fetch function.
     - **Backend**: Apply all filters on every request: `const { page, guests, minPrice } = req.query`. Backend is stateless - each request must include complete filter state. Build WHERE clause from all params.

3. **Wishlist Count Shows Wrong Number After Removal**

   - **Bug**: 5 items in wishlist, remove one, counter shows 5 (should be 4)
   - **Frontend Issue**: Counter state not updated after DELETE call
   - **Backend Issue**: DELETE returns 204 No Content, frontend expects updated count
   - **Fix Time**: ~6 minutes
   - **Solution**:
     - **Backend**: Return new count: `res.status(200).json({ message: 'Removed', count: newCount })` instead of 204. After delete, query: `const [result] = await db.query('SELECT COUNT(*) as count FROM wishlist WHERE user_id = ?')`.
     - **Frontend**: Update count from response: `const { count } = await removeFromWishlist(id); setWishlistCount(count)`. Or decrement: `setWishlistCount(prev => prev - 1)` after successful delete.

4. **Property Images Load Slow and Block UI Render**

   - **Bug**: Opening property details takes 5 seconds to show anything
   - **Frontend Issue**: Images loaded synchronously, blocks render
   - **Backend Issue**: Image URLs returned as full Base64 data instead of CDN links
   - **Fix Time**: ~7 minutes
   - **Solution**:
     - **Backend**: Return CDN URLs: `{ images: ['https://cdn.example.com/img1.jpg', ...] }` not Base64 data. Store images in cloud storage (S3, Cloudinary) and return URLs.
     - **Frontend**: Use lazy loading: `<img loading="lazy" src={url} />`. Show skeleton while loading: `{isLoading ? <Skeleton /> : <img />}`. Load images progressively, don't wait for all to load before rendering content.

5. **Price Range Slider Updates UI But Search Results Don't Change**
   - **Bug**: Moving slider to $150-$300 doesn't trigger new search
   - **Frontend Issue**: Price state updates but doesn't trigger API call (missing useEffect)
   - **Backend Issue**: Endpoint ignores priceMin/priceMax query params
   - **Fix Time**: ~6 minutes
   - **Solution**:
     - **Frontend**: Add useEffect to trigger search: `useEffect(() => { fetchProperties() }, [minPrice, maxPrice])`. Use debounce to avoid too many requests: `useEffect(() => { const timer = setTimeout(() => fetchProperties(), 500); return () => clearTimeout(timer); }, [minPrice, maxPrice])`.
     - **Backend**: Parse and apply price filters: `const { minPrice, maxPrice } = req.query; WHERE price_per_night >= ? AND price_per_night <= ?` with params [minPrice || 0, maxPrice || 999999].

---

#### **HARD (45 minutes) - 5 Bugs**

1. **Booking Dates Available on Calendar But Backend Rejects**

   - **Bug**: Calendar shows Nov 20-25 available (green), booking fails "Dates unavailable"
   - **Frontend Issue**: Calendar fetches availability for wrong month (timezone issue)
   - **Backend Issue**: Availability check uses different timezone than calendar endpoint
   - **Fix Time**: ~10 minutes
   - **Solution**:
     - **Frontend**: Send dates in UTC: `const utcDate = new Date(Date.UTC(year, month, day))`. Or include timezone: `?timezone=America/New_York`.
     - **Backend**: Standardize all date operations to UTC: `const checkIn = moment.utc(req.body.checkIn)`. Use consistent timezone across all endpoints. Calendar and booking endpoints should use identical availability logic. Create shared `isAvailable(propertyId, checkIn, checkOut)` function used by both endpoints.

2. **Real-Time Property Availability Not Synced Across Users**

   - **Bug**: User A books property, User B still sees it available for same dates
   - **Frontend Issue**: No WebSocket or polling for availability updates
   - **Backend Issue**: No event broadcasting mechanism for booking changes
   - **Fix Time**: ~12 minutes
   - **Solution**:
     - **Frontend**: Implement polling: `useEffect(() => { const interval = setInterval(() => fetchAvailability(), 10000); return () => clearInterval(interval); }, [])`. Or WebSocket: `socket.on('booking-created', (data) => updateAvailability(data))`.
     - **Backend**: Emit events on booking: `io.to(\`property-\${propertyId}\`).emit('booking-created', { propertyId, dates })`. Or use Redis pub/sub. Clients subscribe to property-specific channels.

3. **Search Results Out of Order After Sorting Applied**

   - **Bug**: Sort by "Price Low to High", results show: $100, $200, $50, $300
   - **Frontend Issue**: Client-side sort function sorts strings not numbers
   - **Backend Issue**: Returns data unsorted, expects frontend to handle sorting
   - **Fix Time**: ~8 minutes
   - **Solution**:
     - **Frontend**: Sort numerically: `properties.sort((a, b) => a.price - b.price)`. Or use localeCompare for strings: `sort((a, b) => a.title.localeCompare(b.title))`.
     - **Backend**: Handle sorting server-side: `const sortBy = req.query.sortBy; let orderClause = 'ORDER BY created_at DESC'; if (sortBy === 'price-asc') orderClause = 'ORDER BY price_per_night ASC'; ... query += orderClause`. Return sorted data, don't rely on frontend sorting.

4. **Infinite Scroll Loads Properties from Wrong Location After Filter**

   - **Bug**: Search "Los Angeles", scroll down, see New York properties
   - **Frontend Issue**: Scroll handler doesn't preserve location filter in API call
   - **Backend Issue**: Pagination endpoint forgets previous search context
   - **Fix Time**: ~9 minutes
   - **Solution**:
     - **Frontend**: Store filters in state and include in every fetch: `const fetchMore = () => fetch(\`/api/properties?page=\${page}&location=\${location}&guests=\${guests}\`)`. Increment page only, preserve other filters.
     - **Backend**: Stateless design - parse all filters from query params on each request: `const { page, location, guests, amenities } = req.query`. Apply all filters to query. Don't store filter state on server between requests.

5. **Authentication Token Expires Mid-Booking Flow**
   - **Bug**: User halfway through booking (date selected), token expires, form submission fails
   - **Frontend Issue**: No token refresh logic before critical actions
   - **Backend Issue**: Token expires after 15 minutes, booking flow takes 10-20 minutes
   - **Fix Time**: ~6 minutes
   - **Solution**:
     - **Frontend**: Refresh token before critical actions: `const ensureValidToken = async () => { if (isTokenExpiring()) await refreshToken(); }; await ensureValidToken(); submitBooking()`. Or use axios interceptor to auto-refresh on 401.
     - **Backend**: Extend token expiry to 30-60 minutes: `jwt.sign(payload, SECRET, { expiresIn: '30m' })`. Or implement sliding expiration - extend expiry on each request. Provide refresh token endpoint with longer expiry.

---

## **3. BOOKING.COM (HOTEL BOOKING PLATFORM)**

### **3.1 APPLICATION OVERVIEW**

A hotel discovery and booking platform where users search for accommodations, view hotel details, compare options, and book rooms. Dark theme, American English, American typography standards.

---

### **3.2 CORE FEATURES (6 Features)**

#### **Feature 1: User Authentication**

- Sign up with email/password
- Login with validation
- Logout functionality
- User profile with booking history

#### **Feature 2: Hotel Search with Advanced Filters**

- Search by destination (city, landmark, hotel name)
- Date range picker (check-in/check-out)
- Guest and room selection
- Filter by: price, star rating (1-5), amenities (free WiFi, breakfast included, parking, pool), guest rating (6+, 7+, 8+, 9+)
- Sorting: price, rating, distance from center

#### **Feature 3: Hotel Listing Grid**

- Display hotels with primary image, name, star rating, guest rating score, price per night
- "Genius discount" badge for special deals
- Distance from city center
- Key amenities listed
- Pagination

#### **Feature 4: Hotel Details Page**

- Image gallery (10+ photos)
- Full description
- Room types available with prices
- Amenities list
- Location map
- Guest reviews (display only, no submission)
- Cancellation policy

#### **Feature 5: Favorites Management**

- Save hotels to favorites
- Remove from favorites
- View all favorite hotels
- Favorites count in header

#### **Feature 6: Room Booking Flow**

- Select room type
- Choose check-in/check-out dates
- Specify number of guests
- Price breakdown (room rate × nights + taxes)
- Guest information form
- Booking confirmation with booking reference number
- View booking details

---

### **3.3 FRONTEND-ONLY BUGS**

#### **EASY (15 minutes) - 4 Bugs**

1. **Favorite Heart Icon Doesn't Persist Visual State**

   - **Bug**: Adding hotel to favorites briefly shows filled heart, then reverts to outline
   - **Expected**: Heart remains filled after successful add
   - **Root Cause**: State update happens before API response, gets overwritten
   - **Fix Time**: ~3 minutes
   - **Solution**: Wait for API confirmation before UI update: `const response = await addToFavorites(hotelId); if (response.ok) setIsFavorite(true)`. Or use optimistic update correctly: Don't reset state after API call, only on error: `setIsFavorite(true); try { await addToFavorites() } catch { setIsFavorite(false) }`.

2. **Guest Rating Filter Doesn't Display Selected Value**

   - **Bug**: Selecting "8+ rating" doesn't show active state on filter button
   - **Expected**: Selected filter highlighted with distinct color/border
   - **Root Cause**: CSS active class not applied based on state
   - **Fix Time**: ~4 minutes
   - **Solution**: Add conditional class: `className={selectedRating === '8+' ? 'filter-button active' : 'filter-button'}`. Define CSS: `.filter-button.active { background-color: #007bff; color: white; border: 2px solid #0056b3; }`. Ensure state updates on click: `setSelectedRating('8+')`.

3. **Room Count Selector Resets to 1 on Every Re-render**

   - **Bug**: Select 3 rooms, click any filter, rooms reset to 1
   - **Expected**: Room count persists across re-renders
   - **Root Cause**: Uncontrolled input not bound to state properly
   - **Fix Time**: ~3 minutes
   - **Solution**: Use controlled input: `<select value={roomCount} onChange={(e) => setRoomCount(e.target.value)}>`. Initialize state: `const [roomCount, setRoomCount] = useState(1)`. Ensure value prop is bound to state and onChange updates state.

4. **Date Picker Shows Incorrect Month Label**
   - **Bug**: Calendar shows "December 2024" but displays November dates
   - **Expected**: Month label matches displayed dates
   - **Root Cause**: Month index off by one (zero-indexed vs one-indexed)
   - **Fix Time**: ~5 minutes
   - **Solution**: Fix month display: JavaScript months are 0-indexed, so `const monthName = months[date.getMonth()]` not `months[date.getMonth() + 1]`. Or use date library: `format(date, 'MMMM yyyy')`. Ensure month array is: `['January', 'February', ..., 'December']` (12 items, accessed 0-11).

---

#### **INTERMEDIATE (30 minutes) - 5 Bugs**

1. **Hotel Card Image Fails to Load, Shows Broken Icon**

   - **Bug**: Some hotel cards display broken image icon
   - **Expected**: Fallback placeholder image shown
   - **Root Cause**: No onError handler to replace broken src with placeholder
   - **Fix Time**: ~6 minutes
   - **Solution**: Add error handler: `<img src={imageUrl} onError={(e) => { e.target.src = '/placeholder.jpg'; }} alt="Hotel" />`. Or use state: `const [imgSrc, setImgSrc] = useState(imageUrl); <img src={imgSrc} onError={() => setImgSrc('/placeholder.jpg')} />`. Ensure placeholder image exists.

2. **Price Sorting Doesn't Work Correctly**

   - **Bug**: Sort by "Price Low to High" shows: $120, $89, $200, $95
   - **Expected**: Ascending order: $89, $95, $120, $200
   - **Root Cause**: Sorting string values not numeric values
   - **Fix Time**: ~7 minutes
   - **Solution**: Parse prices before sorting: `hotels.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))`. Strip currency symbols if present: `parseFloat(a.price.replace(/[$,]/g, ''))`. Ensure comparison is numeric, not lexicographic.

3. **Filter Chips Don't Remove When Clicking "X"**

   - **Bug**: Applied filter shows chip with X button, clicking X doesn't remove filter
   - **Expected**: Filter removed, results update
   - **Root Cause**: onClick handler on chip not calling filter removal function
   - **Fix Time**: ~5 minutes
   - **Solution**: Add click handler to chip X button: `<button onClick={() => removeFilter(filterId)}>×</button>`. In removeFilter: `const updatedFilters = activeFilters.filter(f => f.id !== filterId); setActiveFilters(updatedFilters); fetchHotels(updatedFilters)`. Ensure results refresh after filter removal.

4. **Mobile Menu Doesn't Close After Filter Selection**

   - **Bug**: On mobile, selecting filter keeps menu open, blocks view
   - **Expected**: Menu closes automatically after filter applied
   - **Root Cause**: Missing state toggle in filter selection handler
   - **Fix Time**: ~6 minutes
   - **Solution**: Close menu after filter selection: `const handleFilterSelect = (filter) => { applyFilter(filter); setIsMenuOpen(false); }`. Or add close button that user can manually trigger. Ensure mobile menu visibility controlled by state: `{isMenuOpen && <MobileMenu />}`.

5. **Booking Form Validation Errors Persist After Fixing Input**
   - **Bug**: Enter invalid phone number, error appears, fix number, error still shows
   - **Expected**: Error clears when input becomes valid
   - **Root Cause**: Validation runs on submit only, not on input change
   - **Fix Time**: ~6 minutes
   - **Solution**: Validate on change: `const handlePhoneChange = (value) => { setPhone(value); if (isValidPhone(value)) setPhoneError(null); else setPhoneError('Invalid phone number'); }`. Or clear error on change, re-validate on blur: `onChange={() => setPhoneError(null)} onBlur={() => validate()}`.

---

#### **HARD (45 minutes) - 5 Bugs**

1. **Lazy Loading Images Causes Layout Shift**

   - **Bug**: Scrolling through hotels causes page to jump as images load
   - **Expected**: Smooth scroll, no layout shifts
   - **Root Cause**: No aspect ratio or height placeholder for image containers
   - **Fix Time**: ~10 minutes
   - **Solution**: Set image container aspect ratio: `<div style={{ aspectRatio: '16/9' }}><img /></div>`. Or set explicit height: `.image-container { height: 200px; }`. Use CSS: `img { object-fit: cover; width: 100%; height: 100%; }`. Reserve space before image loads. Can use `loading="lazy"` with proper sizing.

2. **Filter State Desyncs When Using Browser Back Button**

   - **Bug**: Apply filters, view hotel, press back, filters cleared but results still filtered
   - **Expected**: Filter state matches displayed results
   - **Root Cause**: URL query params not synced with component state
   - **Fix Time**: ~12 minutes
   - **Solution**: Sync state with URL: `useEffect(() => { const params = new URLSearchParams(location.search); setFilters({ minPrice: params.get('minPrice'), ... }); }, [location.search])`. Update URL on filter change: `const applyFilter = (filter) => { setFilters(filter); navigate(\`?minPrice=\${filter.minPrice}&...\`); }`. Use query params as source of truth.

3. **Multiple Rapid Filter Changes Cause UI to Freeze**

   - **Bug**: Quickly toggling 5+ filters makes app unresponsive for 3-4 seconds
   - **Expected**: Smooth filter application
   - **Root Cause**: Each filter change triggers full component re-render, no debouncing
   - **Fix Time**: ~9 minutes
   - **Solution**: Debounce filter updates: `const debouncedFetch = debounce(fetchHotels, 300); useEffect(() => { debouncedFetch(filters) }, [filters])`. Use React.memo on child components. Batch state updates: `setFilters(prev => ({ ...prev, ...newFilters }))`. Use useTransition for non-urgent updates: `const [isPending, startTransition] = useTransition(); startTransition(() => setFilters(...))`.

4. **Room Selection Modal Doesn't Prevent Body Scroll**

   - **Bug**: Opening room selection modal still allows scrolling background page
   - **Expected**: Background scroll disabled when modal open
   - **Root Cause**: Missing overflow: hidden on body element
   - **Fix Time**: ~7 minutes
   - **Solution**: Toggle body scroll on modal open/close: `useEffect(() => { if (isModalOpen) { document.body.style.overflow = 'hidden'; } return () => { document.body.style.overflow = 'unset'; }; }, [isModalOpen])`. Or use CSS class: `body.modal-open { overflow: hidden; }` and toggle class with JavaScript.

5. **Date Range Selection Allows Same Day Check-In and Check-Out**
   - **Bug**: Can select Nov 20 for both check-in and check-out (0 nights)
   - **Expected**: Minimum 1-night stay enforced
   - **Root Cause**: Date validation missing in onChange handler
   - **Fix Time**: ~7 minutes
   - **Solution**: Validate minimum stay: `const handleCheckOutChange = (date) => { const minCheckOut = addDays(checkIn, 1); if (date < minCheckOut) { alert('Minimum 1 night stay'); return; } setCheckOut(date); }`. Or auto-adjust: `if (date <= checkIn) setCheckOut(addDays(checkIn, 1))`. Set minDate prop on check-out picker: `minDate={addDays(checkIn, 1)}`.

---

### **3.4 BACKEND-ONLY BUGS**

#### **EASY (15 minutes) - 4 Bugs**

1. **GET /hotels Returns Soft-Deleted Hotels**

   - **Bug**: Hotels marked as deleted still appear in search
   - **Expected**: Only active hotels returned
   - **Root Cause**: Missing WHERE deleted_at IS NULL filter
   - **Fix Time**: ~3 minutes
   - **Solution**: Add filter for soft deletes: `SELECT * FROM hotels WHERE deleted_at IS NULL AND status = 'active'`. Or use active flag: `WHERE is_active = true`. Apply this filter to all hotel listing queries. Create database index on deleted_at column for performance.

2. **POST /bookings Allows Booking Past Check-Out Date**

   - **Bug**: Can book check-out date as Nov 19 when today is Nov 20
   - **Expected**: Error returned for past dates
   - **Root Cause**: No date validation comparing check-in/check-out with current date
   - **Fix Time**: ~4 minutes
   - **Solution**: Validate dates against current date: `const today = new Date().toISOString().split('T')[0]; if (checkIn < today || checkOut < today) return res.status(400).json({ error: 'Cannot book past dates' })`. Also validate checkOut > checkIn: `if (checkOut <= checkIn) return res.status(400).json({ error: 'Check-out must be after check-in' })`.

3. **Favorites Endpoint Returns 500 When List Is Empty**

   - **Bug**: GET /favorites crashes when user has no favorites
   - **Expected**: Return empty array with 200 status
   - **Root Cause**: Attempting .forEach() on null result
   - **Fix Time**: ~4 minutes
   - **Solution**: Initialize with empty array: `const favorites = results || []; res.json({ favorites })`. Or check before processing: `if (!results || results.length === 0) return res.json({ favorites: [] })`. Ensure query returns empty array not null: `SELECT COALESCE(JSON_ARRAYAGG(...), JSON_ARRAY()) as favorites`.

4. **Price Per Night Calculation Doesn't Round Correctly**
   - **Bug**: Total $149.99 for 3 nights shows as $49.99666 per night
   - **Expected**: $49.99 per night (rounded to 2 decimals)
   - **Root Cause**: No Math.round() or .toFixed(2) in division
   - **Fix Time**: ~3 minutes
   - **Solution**: Round to 2 decimals: `const pricePerNight = (totalPrice / nights).toFixed(2)`. Or: `Math.round((totalPrice / nights) * 100) / 100`. Return as number or string depending on API spec. Ensure consistent currency formatting.

---

#### **INTERMEDIATE (30 minutes) - 6 Bugs**

1. **Star Rating Filter Returns Hotels with Lower Ratings**

   - **Bug**: Filter "4-star hotels" returns 3-star hotels too
   - **Expected**: Only 4-star hotels
   - **Root Cause**: SQL uses >= instead of = for star rating comparison
   - **Fix Time**: ~5 minutes
   - **Solution**: Use exact match: `WHERE star_rating = ?` not `WHERE star_rating >= ?`. If range needed, specify: `WHERE star_rating BETWEEN ? AND ?`. For "4-star and above" use `>= 4`, but default should be exact match.

2. **Search Results Don't Respect Guest Count**

   - **Bug**: Search for 6 guests returns hotels with max 4 guests
   - **Expected**: Only hotels accommodating ≥6 guests
   - **Root Cause**: Query doesn't join with room_capacity or filters incorrectly
   - **Fix Time**: ~7 minutes
   - **Solution**: Filter by room capacity: `SELECT DISTINCT h.* FROM hotels h JOIN rooms r ON h.id = r.hotel_id WHERE r.max_guests >= ?`. Or if hotel-level capacity: `WHERE max_guests >= ?`. Ensure JOIN doesn't eliminate hotels, use proper GROUP BY if needed.

3. **Distance Sorting Doesn't Work**

   - **Bug**: Sort by "Distance from center" shows random order
   - **Expected**: Ascending order by distance
   - **Root Cause**: Missing ORDER BY distance_km in SQL
   - **Fix Time**: ~5 minutes
   - **Solution**: Add ORDER BY clause: `SELECT *, distance_from_center FROM hotels WHERE ... ORDER BY distance_from_center ASC`. Ensure distance column exists and is numeric. Parse sortBy param: `if (sortBy === 'distance') orderBy = 'ORDER BY distance_from_center ASC'`.

4. **Amenities Filter Requires ALL Instead of ANY**

   - **Bug**: Filter "WiFi OR Pool" returns hotels with both (should show hotels with at least one)
   - **Expected**: Hotels matching ANY selected amenity
   - **Root Cause**: SQL uses AND between amenities instead of OR
   - **Fix Time**: ~6 minutes
   - **Solution**: Use IN clause for OR logic: `SELECT DISTINCT h.* FROM hotels h JOIN hotel_amenities ha ON h.id = ha.hotel_id WHERE ha.amenity_id IN (?, ?, ?)` where ? are selected amenity IDs. This returns hotels with at least one matching amenity. Remove HAVING COUNT requirement.

5. **Pagination Skips Every Other Hotel on Page 2**

   - **Bug**: Page 1 shows hotels 1-20, Page 2 shows hotels 41-60 (skips 21-40)
   - **Expected**: Page 2 shows 21-40
   - **Root Cause**: OFFSET calculation uses `page * limit` instead of `(page - 1) * limit`
   - **Fix Time**: ~5 minutes
   - **Solution**: Fix offset formula: `const offset = (page - 1) * limit; query += ' LIMIT ? OFFSET ?' with [limit, offset]`. For page=1: offset=0, page=2: offset=20, page=3: offset=40. Ensure page starts at 1, not 0.

6. **Booking Confirmation Email Sent Before Payment Verification**
   - **Bug**: Confirmation email sent, but payment fails 5 seconds later
   - **Expected**: Email sent only after successful payment
   - **Root Cause**: Email trigger not wrapped in payment transaction
   - **Fix Time**: ~6 minutes
   - **Solution**: Send email after payment confirmation: `const paymentResult = await processPayment(); if (paymentResult.success) { await createBooking(); await sendConfirmationEmail(); res.json({ success: true }); } else { res.status(400).json({ error: 'Payment failed' }); }`. Wrap in transaction to ensure atomicity.

---

#### **HARD (45 minutes) - 5 Bugs**

1. **Double Booking Possible Due to Race Condition**

   - **Bug**: Two users simultaneously book last available room for same dates
   - **Expected**: Second booking fails with "Room unavailable"
   - **Root Cause**: No row-level locking (SELECT FOR UPDATE missing)
   - **Fix Time**: ~12 minutes
   - **Solution**: Use pessimistic locking: `BEGIN; SELECT * FROM rooms WHERE id = ? AND hotel_id = ? FOR UPDATE; SELECT COUNT(*) FROM bookings WHERE room_id = ? AND ((check_in <= ? AND check_out >= ?) OR (check_in <= ? AND check_out >= ?)); if (count > 0) { ROLLBACK; return error; } INSERT INTO bookings ...; COMMIT;`. FOR UPDATE locks row until commit. Set appropriate transaction isolation level (READ COMMITTED or higher).

2. **N+1 Query Problem Loading Hotel Reviews**

   - **Bug**: Loading 20 hotels makes 61 queries (1 main + 20 reviews + 20 amenities + 20 images)
   - **Expected**: Optimized JOIN, max 4 queries
   - **Root Cause**: Loop through each hotel to fetch related data sequentially
   - **Fix Time**: ~10 minutes
   - **Solution**: Use JOINs with aggregation: `SELECT h.*, JSON_ARRAYAGG(JSON_OBJECT('id', r.id, 'text', r.review_text, 'rating', r.rating)) as reviews, JSON_ARRAYAGG(DISTINCT JSON_OBJECT('id', a.id, 'name', a.name)) as amenities FROM hotels h LEFT JOIN reviews r ON h.id = r.hotel_id LEFT JOIN hotel_amenities ha ON h.id = ha.hotel_id LEFT JOIN amenities a ON ha.amenity_id = a.id GROUP BY h.id`. Or use dataloader pattern for N+1 prevention.

3. **Average Guest Rating Includes Flagged/Spam Reviews**

   - **Bug**: Hotel shows 8.5 rating, includes 50 spam reviews (should be 9.2 without them)
   - **Expected**: Rating calculated from verified reviews only
   - **Root Cause**: AVG() aggregation doesn't filter reviews.status = 'verified'
   - **Fix Time**: ~8 minutes
   - **Solution**: Filter in aggregation: `SELECT AVG(rating) as avg_rating FROM reviews WHERE hotel_id = ? AND status = 'verified' AND is_flagged = false`. Update hotel ratings periodically: `UPDATE hotels SET avg_rating = (SELECT AVG(rating) FROM reviews WHERE hotel_id = hotels.id AND status = 'verified')`. Display only verified ratings to users.

4. **Room Availability Check Doesn't Account for Timezone**

   - **Bug**: Hotel in London shows available, but booking fails "Room booked" (timezone conflict)
   - **Expected**: Availability accurate across timezones
   - **Root Cause**: Server uses UTC, comparison doesn't normalize to hotel's local timezone
   - **Fix Time**: ~9 minutes
   - **Solution**: Store hotel timezone: `hotels.timezone = 'Europe/London'`. Convert dates to hotel timezone: `const hotelCheckIn = moment.tz(checkIn, hotel.timezone).utc()`. Store all dates as UTC in database: `bookings.check_in_utc`. Compare in UTC: `WHERE check_in_utc <= ? AND check_out_utc >= ?`. Display dates to user in hotel's local timezone.

5. **Search Performance Degrades with Large Date Ranges**
   - **Bug**: Searching 30-day availability takes 15 seconds (vs 1 second for 3 days)
   - **Expected**: Consistent performance regardless of date range
   - **Root Cause**: Inefficient subquery for each date in range, missing database index
   - **Fix Time**: ~6 minutes
   - **Solution**: Add compound index: `CREATE INDEX idx_bookings_availability ON bookings(room_id, check_in, check_out)`. Optimize query to check range overlap once: `SELECT r.* FROM rooms r WHERE r.hotel_id = ? AND NOT EXISTS (SELECT 1 FROM bookings b WHERE b.room_id = r.id AND b.check_in < ? AND b.check_out > ?)`. Use date range comparison, not per-day iteration.

---

### **3.5 FULL-STACK BUGS**

#### **EASY (15 minutes) - 4 Bugs**

1. **Favorite Button Shows Success But Doesn't Persist**

   - **Bug**: Add hotel to favorites, refresh page, it's gone
   - **Frontend Issue**: Optimistic update doesn't revert on API failure
   - **Backend Issue**: POST endpoint returns 200 but INSERT fails silently (duplicate key)
   - **Fix Time**: ~4 minutes
   - **Solution**:
     - **Backend**: Handle duplicate key error: `try { await db.query('INSERT INTO favorites...'); res.json({ success: true }); } catch (err) { if (err.code === 'ER_DUP_ENTRY') res.status(409).json({ error: 'Already in favorites' }); else res.status(500).json({ error: 'Failed' }); }`.
     - **Frontend**: Revert on error: `setIsFavorite(true); try { await addToFavorites(); } catch { setIsFavorite(false); alert('Failed to add'); }`. Or fetch favorites on mount: `useEffect(() => { fetchFavorites() }, [])` to sync with server state.

2. **Search Shows Results But Header Says "0 Hotels Found"**

   - **Bug**: 12 hotels displayed, header shows "0 hotels found in [city]"
   - **Frontend Issue**: Reads count from wrong response property (data.count vs data.total)
   - **Backend Issue**: Response structure has "total" not "count"
   - **Fix Time**: ~3 minutes
   - **Solution**:
     - **Backend**: Standardize response: `res.json({ hotels: [...], count: totalCount })` not "total".
     - **Frontend**: Read correct property: `const { hotels, count } = response.data; <h1>{count} hotels found</h1>`. Or add fallback: `const count = response.data.count || response.data.total || 0`.

3. **Booking Confirmation Shows Wrong Guest Count**

   - **Bug**: Booked for 3 guests, confirmation shows 1 guest
   - **Frontend Issue**: Sends guestCount as string "3"
   - **Backend Issue**: Parses string as integer incorrectly, defaults to 1
   - **Fix Time**: ~4 minutes
   - **Solution**:
     - **Frontend**: Send as number: `body: JSON.stringify({ ...booking, guestCount: parseInt(guestCount) })`. Or ensure input type is number: `<input type="number" />`.
     - **Backend**: Parse correctly: `const guestCount = parseInt(req.body.guestCount) || 1`. Validate: `if (isNaN(guestCount) || guestCount < 1) return res.status(400).json({ error: 'Invalid guest count' })`.

4. **Login Successful But Dashboard Shows Error Message**
   - **Bug**: Correct credentials, redirected to dashboard with "Authentication failed" banner
   - **Frontend Issue**: Checks response.status === 201 (backend returns 200)
   - **Backend Issue**: Returns 200 instead of documented 201
   - **Fix Time**: ~4 minutes
   - **Solution**:
     - **Backend**: Match documentation: `res.status(201).json({ token, user })`. Or update docs to reflect 200.
     - **Frontend**: Accept both status codes: `if (response.ok)` or `if (response.status === 200 || response.status === 201)`. Use axios success interceptor: `response.status < 300`.

---

#### **INTERMEDIATE (30 minutes) - 5 Bugs**

1. **Date Filter Applied But All Hotels Still Visible**

   - **Bug**: Select Nov 20-25, hotels unavailable for those dates still show
   - **Frontend Issue**: Date params sent in MM/DD/YYYY format
   - **Backend Issue**: Expects ISO 8601 format, parsing fails, ignores filter
   - **Fix Time**: ~7 minutes
   - **Solution**:
     - **Frontend**: Send ISO format: `const checkInISO = checkIn.toISOString(); fetch(\`/api/hotels?checkIn=\${checkInISO}&checkOut=\${checkOutISO}\`)`. Or date-only: `checkIn.toISOString().split('T')[0]` (YYYY-MM-DD).
     - **Backend**: Parse with validation: `const checkIn = new Date(req.query.checkIn); if (isNaN(checkIn.getTime())) return res.status(400).json({ error: 'Invalid date format. Use ISO 8601' })`. Document expected format in API docs.

2. **Guest Rating Filter Works But Pagination Resets Filter**

   - **Bug**: Filter "8+ rating", page 1 correct, page 2 shows all ratings
   - **Frontend Issue**: Pagination request URL doesn't include ratingFilter param
   - **Backend Issue**: Stateless endpoint, doesn't remember filter from page 1
   - **Fix Time**: ~8 minutes
   - **Solution**:
     - **Frontend**: Include filters in pagination: `fetch(\`/api/hotels?page=\${page}&guestRating=\${guestRating}&starRating=\${starRating}\`)`. Build URL from current filter state.
     - **Backend**: Parse all filters on every request: `const { page, guestRating, starRating, amenities } = req.query`. Apply all to WHERE clause. Backend is stateless - each request must include complete context.

3. **Favorites Count Out of Sync After Removal**

   - **Bug**: 4 favorites, remove one, counter shows 4 (should be 3)
   - **Frontend Issue**: Counter decrements before API confirms deletion (fails silently)
   - **Backend Issue**: DELETE returns 204 No Content, no updated count in response
   - **Fix Time**: ~6 minutes
   - **Solution**:
     - **Frontend**: Wait for confirmation: `await removeFavorite(id).then(() => setFavoritesCount(prev => prev - 1))`. Handle errors: `.catch(() => alert('Failed to remove'))`.
     - **Backend**: Return count: `const result = await db.query('DELETE FROM favorites WHERE id = ?'); const [count] = await db.query('SELECT COUNT(*) FROM favorites WHERE user_id = ?'); res.json({ success: true, count: count[0].count })`.

4. **Room Selection Updates Price But Booking Fails with Old Price**

   - **Bug**: Select deluxe room ($200), UI shows $200, booking confirmation shows $150 (standard room)
   - **Frontend Issue**: Sends roomId but not roomPrice in booking request
   - **Backend Issue**: Fetches price from database but uses stale cached price
   - **Fix Time**: ~7 minutes
   - **Solution**:
     - **Frontend**: Include price in request: `body: { roomId, roomPrice, checkIn, checkOut }`. Or fetch fresh price before booking: `const { price } = await getRoomPrice(roomId); submitBooking({ roomId, price })`.
     - **Backend**: Always fetch latest price from database: `SELECT price FROM rooms WHERE id = ? FOR UPDATE`. Don't use cached prices for financial transactions. Clear cache: `redis.del(\`room:price:\${roomId}\`)` after price update.

5. **Search Results Load Slowly, Show Spinner for 8 Seconds**
   - **Bug**: Simple search takes 8 seconds to return results
   - **Frontend Issue**: Sequential API calls (search, then amenities, then reviews)
   - **Backend Issue**: Each endpoint slow, no caching, not optimized
   - **Fix Time**: ~6 minutes
   - **Solution**:
     - **Frontend**: Make parallel requests: `const [hotels, amenities] = await Promise.all([fetchHotels(), fetchAmenities()])`. Or fetch all data in single endpoint call. Show partial results immediately: render hotels first, then add amenities when loaded.
     - **Backend**: Optimize query with JOINs (see Hard bug #2). Add caching: `const cached = await redis.get('search:' + cacheKey); if (cached) return res.json(JSON.parse(cached))`. Set cache TTL: `redis.setex(key, 300, JSON.stringify(results))`. Add database indexes on frequently filtered columns.

---

#### **HARD (45 minutes) - 5 Bugs**

1. **Room Availability Calendar Shows Different Data Than Booking API**

   - **Bug**: Calendar shows Nov 20-25 available, booking fails "Dates unavailable"
   - **Frontend Issue**: Calendar fetches availability from /calendar endpoint
   - **Backend Issue**: /calendar and /bookings use different availability logic, not synced
   - **Fix Time**: ~12 minutes
   - **Solution**:
     - **Backend**: Create shared availability function: `function checkAvailability(roomId, checkIn, checkOut) { return db.query('SELECT COUNT(*) FROM bookings WHERE room_id = ? AND check_in < ? AND check_out > ?', [roomId, checkOut, checkIn]); }`. Use same function in both endpoints: `/calendar` and `/bookings`. Ensure identical date parsing and timezone handling.
     - **Frontend**: Use same date format for both requests. Validate calendar data: before booking, re-check availability. Show loading state during validation.

2. **Multiple Users Booking Same Room Causes Overbooking**

   - **Bug**: User A and User B both book same room for same dates
   - **Frontend Issue**: No real-time availability updates (no WebSocket)
   - **Backend Issue**: No transaction locking during booking process
   - **Fix Time**: ~10 minutes
   - **Solution**:
     - **Backend**: Use transaction with locking: `BEGIN; SELECT * FROM rooms WHERE id = ? FOR UPDATE; SELECT COUNT(*) FROM bookings WHERE room_id = ? AND check_in < ? AND check_out > ?; if (count > 0) { ROLLBACK; return 409 error; } INSERT INTO bookings ...; COMMIT;`. Add unique constraint: `UNIQUE(room_id, check_in, check_out)` as additional safety.
     - **Frontend**: Implement polling: `useEffect(() => { const interval = setInterval(() => checkAvailability(), 5000); return () => clearInterval(interval); }, [])`. Or WebSocket: `socket.on('room-booked', updateUI)`. Show warning if room becomes unavailable during booking process.

3. **Search Results Order Changes When Paginating**

   - **Bug**: Page 1 Hotel A at position 5, go to page 2 and back, Hotel A now at position 8
   - **Frontend Issue**: Not passing sortOrder to pagination requests
   - **Backend Issue**: No deterministic ORDER BY, database returns random order
   - **Fix Time**: ~8 minutes
   - **Solution**:
     - **Frontend**: Include sort in pagination URL: `fetch(\`/api/hotels?page=\${page}&sortBy=\${sortBy}&sortOrder=\${sortOrder}\`)`. Store sort state and pass with every request.
     - **Backend**: Add deterministic ORDER BY: `ORDER BY ${sortBy} ${sortOrder}, id ASC`. The secondary `id` sort ensures consistent order when primary sort values are equal. Default: `ORDER BY created_at DESC, id ASC`. Apply before LIMIT/OFFSET.

4. **Filter Applied, Infinite Scroll Loads Unfiltered Results**

   - **Bug**: Filter "Free WiFi", scroll down, see hotels without WiFi
   - **Frontend Issue**: Scroll handler API call doesn't include filter params
   - **Backend Issue**: Pagination endpoint stateless, forgets previous filters
   - **Fix Time**: ~9 minutes
   - **Solution**:
     - **Frontend**: Store filters in state, include in every fetch: `const fetchMore = () => { fetch(\`/api/hotels?page=\${nextPage}&amenities=\${amenities.join(',')}&minPrice=\${minPrice}\`) }`. Increment page but preserve all other parameters.
     - **Backend**: Parse all params on each request: `const { page, amenities, minPrice, maxPrice, starRating } = req.query`. Build complete WHERE clause from all params. Server is stateless - client sends full context each time.

5. **Auth Token Expires During Booking, Payment Fails**
   - **Bug**: User selects room (5 min ago), enters payment info, submit fails "Unauthorized"
   - **Frontend Issue**: No token refresh before critical payment action
   - **Backend Issue**: Token expires after 15 minutes, booking flow takes 10-20 minutes
   - **Fix Time**: ~6 minutes
   - **Solution**:
     - **Frontend**: Check token before submission: `const ensureValidToken = async () => { const decoded = jwtDecode(token); if (decoded.exp * 1000 < Date.now() + 60000) await refreshToken(); }; await ensureValidToken(); submitBooking()`. Or use axios interceptor: `axios.interceptors.response.use(null, async (error) => { if (error.response.status === 401) { await refreshToken(); return axios.request(error.config); } })`.
     - **Backend**: Extend token expiry: `jwt.sign(payload, SECRET, { expiresIn: '1h' })`. Implement sliding expiration: refresh token on each request if less than 15 minutes remaining. Provide long-lived refresh token: `{ accessToken: '15m', refreshToken: '7d' }`.

---

## **END OF PRD**

---

## **DELIVERABLE SUMMARY**

App specifications:

1. **Fandango** - Movie booking platform
2. **AirBnB** - Property rental platform
3. **Booking.com** - Hotel booking platform

Each app includes:

- 6 core features with detailed functionality
- Bug lists for **frontend-only**, **backend-only**, and **full-stack** scenarios
- Three difficulty levels (Easy, Intermediate, Hard) with **isolated** bug sets
- Estimated fix times for each bug
- Root cause analysis for implementation clarity
- **Complete solutions** for each bug with code examples and implementation details

All bugs are self-contained, won't block other features, and are designed to be validated via automated test suites (Jest/Cypress).

**Technology agnostic**: This PRD focuses on features and bug scenarios, allowing implementation in any tech stack.

**Dark theme, American English, American typography**: All applications must follow these design standards strictly.

---

## **TEST CASE GUIDANCE**

### **Writing Test Cases Based on Solutions**

For each bug, test cases should follow this pattern:

**PASSING TEST** (when bug is fixed):

- Test validates the solution works correctly
- Example: For "Watchlist Button Not Toggling" - test clicks button, asserts state changes, asserts UI updates

**FAILING TEST** (when bug exists):

- Test validates the buggy behavior fails
- Example: For "Watchlist Button Not Toggling" - test clicks button, asserts state does NOT change (or changes incorrectly)

### **Test Case Structure**

```javascript
describe("Bug: Watchlist Button Not Toggling", () => {
  it('should toggle button text from "Add" to "Remove" when clicked', () => {
    // Arrange: Setup component with movie not in watchlist
    render();

    // Act: Click the button
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Add to Watchlist");
    fireEvent.click(button);

    // Assert: Button text should change
    expect(button).toHaveTextContent("Remove from Watchlist");
  });
});
```

**This test PASSES when bug is fixed (solution implemented)**
**This test FAILS when bug exists (before fix)**

### **Implementation Guidelines**

1. Create separate codebases for each difficulty level (Easy, Intermediate, Hard)
2. Introduce bugs exactly as described in "Bug" section
3. Write test cases based on "Expected" behavior
4. Test cases should fail with buggy code, pass with solution
5. Each bug is independent - fixing one shouldn't break others
