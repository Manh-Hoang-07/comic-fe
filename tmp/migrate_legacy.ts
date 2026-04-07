import { Project, QuoteKind } from "ts-morph";
import * as path from "path";
import * as fs from "fs";

const project = new Project({
  manipulationSettings: {
    quoteKind: QuoteKind.Double,
  },
});

const sourceFiles = [
  "src/components/Features/Posts/PostList/Admin/AdminPosts.tsx",
  "src/components/Features/Posts/Tags/Admin/AdminPostTags.tsx",
  "src/components/Features/Posts/Comments/Admin/AdminPostComments.tsx",
  "src/components/Features/Posts/Categories/Admin/AdminPostCategories.tsx",
  "src/components/Features/Introduction/Testimonials/Admin/AdminTestimonials.tsx",
  "src/components/Features/Introduction/Staff/Admin/AdminStaff.tsx",
  "src/components/Features/Introduction/Partners/Admin/AdminPartners.tsx",
  "src/components/Features/Introduction/Projects/Admin/AdminProjects.tsx",
  "src/components/Features/Introduction/Galleries/Admin/AdminGallery.tsx",
  "src/components/Features/Marketing/Locations/Admin/AdminBannerLocations.tsx",
  "src/components/Features/Introduction/Faqs/Admin/AdminFAQs.tsx",
  "src/components/Features/Introduction/Contacts/Admin/AdminContacts.tsx",
  "src/components/Features/Introduction/Certificates/Admin/AdminCertificates.tsx",
  "src/components/Features/Marketing/Banners/Admin/AdminBanners.tsx",
  "src/components/Features/Core/Users/Admin/AdminUsers.tsx",
  "src/components/Features/Core/Roles/Admin/AdminRoles.tsx",
  "src/components/Features/Core/Permissions/Admin/AdminPermissions.tsx",
  "src/components/Features/Core/Menus/Admin/AdminMenus.tsx",
  "src/components/Features/Core/Locations/Wards/Admin/AdminWards.tsx",
  "src/components/Features/Core/Locations/Countries/Admin/AdminCountries.tsx",
  "src/components/Features/Core/Locations/Provinces/Admin/AdminProvinces.tsx",
  "src/components/Features/Core/Groups/Admin/AdminGroups.tsx",
  "src/components/Features/Introduction/About/Admin/AdminAboutSections.tsx",
  "src/components/Features/Core/ContentTemplates/Admin/AdminContentTemplates.tsx",
  "src/components/Features/Comics/Comments/Admin/AdminComicComments.tsx",
  "src/components/Features/Comics/ComicList/Admin/AdminComics.tsx",
  "src/components/Features/Comics/Chapters/Admin/AdminChapters.tsx",
  "src/components/Features/Comics/Categories/Admin/AdminComicCategories.tsx",
];

sourceFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) return;

  const sourceFile = project.addSourceFileAtPath(fullPath);
  
  // Replace useListPage with useLegacyListPage
  sourceFile.getDescendantsOfKind(159 /* Identifier */).forEach(id => {
    if (id.getText() === "useListPage") {
      id.replaceWithText("useLegacyListPage");
    }
    if (id.getText() === "useAdminListPage") {
      id.replaceWithText("useLegacyAdminListPage");
    }
  });

  // Check imports
  const hooksImport = sourceFile.getImportDeclaration(i => i.getModuleSpecifierValue() === "@/hooks");
  if (hooksImport) {
    const namedImports = hooksImport.getNamedImports();
    let updated = false;
    
    namedImports.forEach(ni => {
        if (ni.getName() === "useListPage") {
            ni.replaceWithText("useLegacyListPage");
            updated = true;
        }
        if (ni.getName() === "useAdminListPage") {
            ni.replaceWithText("useLegacyAdminListPage");
            updated = true;
        }
    });
  }

  sourceFile.saveSync();
});
