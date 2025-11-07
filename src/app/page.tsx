export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-24 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Welcome to TMX Content Generator
      </h1>
      <p className="text-center text-base sm:text-lg mb-8 text-muted-foreground line-through">
        copy pasta's function are in the social poster generator page.
      </p>
      <p className="text-center text-base sm:text-lg mb-8 text-muted-foreground line-through">
        copy pasta's got power crept once again lol.
      </p>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Change History (AI generated)</h2>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">1. Initial Commit (Fri Oct 11 14:27:11 2024)</h3>
            <div className="text-sm text-gray-700">
              <strong>Type:</strong> File Creation<br/>
              <strong>Changes:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Created the initial Next.js homepage with default template content</li>
                <li>Included Next.js logo, documentation links, and deployment buttons</li>
                <li>Basic responsive layout with grid system</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">2. Everything Setup (Fri Oct 11 14:36:16 2024)</h3>
            <div className="text-sm text-gray-700">
              <strong>Type:</strong> Major Refactor<br/>
              <strong>Changes:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Removed:</strong> All default Next.js template content</li>
                <li><strong>Added:</strong> Complete social media content generator functionality</li>
                <li><strong>Added:</strong> TypeScript types for crop names (CropName union type)</li>
                <li><strong>Added:</strong> Constants for locations, crops, and translations</li>
                <li><strong>Added:</strong> State management for locations, crop, date, and generated content</li>
                <li><strong>Added:</strong> UI components for location selection, crop selection, date input</li>
                <li><strong>Added:</strong> Content generation logic for YouTube, Facebook, and Instagram</li>
                <li><strong>Added:</strong> Tabbed interface for displaying generated content</li>
                <li><strong>Added:</strong> Copy-to-clipboard functionality with toast notifications</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">3. Fixed Hashtags for Instagram (Sat Oct 12 13:33:59 2024)</h3>
            <div className="text-sm text-gray-700">
              <strong>Type:</strong> Content Update<br/>
              <strong>Changes:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Modified:</strong> Separated Instagram content generation from Facebook</li>
                <li><strong>Added:</strong> Instagram-specific tags (different from Facebook tags)</li>
                <li><strong>Updated:</strong> Instagram message generation with proper organization references</li>
                <li><strong>Added:</strong> Separate Instagram content state and UI</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">4. Added CBT for Cashew Nuts (Mon Oct 14 11:43:47 2024)</h3>
            <div className="text-sm text-gray-700">
              <strong>Type:</strong> Logic Update<br/>
              <strong>Changes:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Modified:</strong> Organization selection logic to use CBT for cashew crops instead of COPRA</li>
                <li><strong>Updated:</strong> Content generation to dynamically select organization based on crop type</li>
                <li><strong>Fixed:</strong> Location formatting (changed from uppercase to lowercase for Swahili locations)</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">5. Added Price Result Copy Pasta (Mon Oct 14 13:44:06 2024)</h3>
            <div className="text-sm text-gray-700">
              <strong>Type:</strong> Feature Addition<br/>
              <strong>Changes:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Added:</strong> Commodity price result content for both Facebook and Instagram</li>
                <li><strong>Added:</strong> New state properties (instagramResult, facebookResult)</li>
                <li><strong>Added:</strong> Additional tab content sections for price results</li>
                <li><strong>Added:</strong> Separate content generation for price information with appropriate tags</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">6. Upper Case Changes (Tue Oct 29 09:34:05 2024)</h3>
            <div className="text-sm text-gray-700">
              <strong>Type:</strong> Text Formatting Fix<br/>
              <strong>Changes:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Modified:</strong> Location formatting logic to use proper title case (first letter uppercase, rest lowercase)</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">7. Added Breadcrumbs (Tue Oct 29 12:54:37 2024)</h3>
            <div className="text-sm text-gray-700">
              <strong>Type:</strong> Layout Update<br/>
              <strong>Changes:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Modified:</strong> Container padding from pl-16 to px-24 for better centering</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">8. Added Navigation (Tue Oct 29 13:14:35 2024)</h3>
            <div className="text-sm text-gray-700">
              <strong>Type:</strong> Component Refactor<br/>
              <strong>Changes:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Removed:</strong> SocialMediaTitleGenerator component import and usage</li>
                <li><strong>Modified:</strong> Page title from "TMX Social Media Content Generator" to "Welcome to TMX Content Generator"</li>
                <li><strong>Replaced:</strong> Full generator UI with simple welcome message</li>
                <li><strong>Updated:</strong> Description text to guide users to sidebar navigation</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">9. Added Side Bar (Tue Oct 29 12:25:38 2024)</h3>
            <div className="text-sm text-gray-700">
              <strong>Type:</strong> Major Refactor<br/>
              <strong>Changes:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Removed:</strong> All social media generator code (332 lines)</li>
                <li><strong>Added:</strong> Simple homepage with title and description</li>
                <li><strong>Modified:</strong> Layout to use container mx-auto pl-16 py-10</li>
                <li><strong>Updated:</strong> Title to "TMX Social Media Content Generator"</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">10. Refactor Code Structure (Fri Jul 18 11:45:34 2025)</h3>
            <div className="text-sm text-gray-700">
              <strong>Type:</strong> Content Update<br/>
              <strong>Changes:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Modified:</strong> Welcome message from "Select an option from the sidebar to get started." to "Added new features and fixed bugs. Explore the sidebar to navigate through different sections."</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mt-8">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Summary</h3>
          <p className="text-sm text-gray-700">
            The file evolved from a default Next.js template to a comprehensive social media content generator, then was simplified to a navigation hub as functionality was moved to separate pages. The most significant changes were the initial implementation of the full generator (commit b914be3) and the subsequent refactoring to use separate pages with navigation (commits 603d3d9 and 386907d).
          </p>
        </div>
      </div>
    </div>
  );
}
