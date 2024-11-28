"use client";
import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { EditorState, RichUtils, convertFromRaw, convertToRaw } from "draft-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Copy } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Dynamically load the Draft.js Editor component
const DynamicEditor = dynamic(() => import("draft-js").then((mod) => mod.Editor), { ssr: false }); 



// ShareButton Component
const ShareButton = () => {
  const [permission, setPermission] = useState<"canEdit" | "canView">("canEdit");
  const [email, setEmail] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false); // New state for public/private
  const [shareableLink, setShareableLink] = useState<string>("");

  // Handle permission change
  const handlePermissionChange = (newPermission: "canEdit" | "canView") => {
    setPermission(newPermission);
  };

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Handle toggling of public/private mode
  const togglePublicPrivate = () => {
    setIsPublic((prev) => !prev);

    if (!isPublic) {
      // Generate a unique link when the document is public
      const generatedLink = `https://myapp.com/docs/${Math.random().toString(36).substring(2, 15)}`;
      setShareableLink(generatedLink);
    } else {
      setShareableLink(""); // Clear link if set to private
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
        </DialogHeader>

        {/* Permission Dropdown */}
        <div className="mb-4">
          <Label>Permission</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{permission === "canEdit" ? "Can Edit" : "Can View"}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handlePermissionChange("canEdit")}>Can Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePermissionChange("canView")}>Can View</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <Label>Email</Label>
          <Input
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter email addresses"
            className="w-full"
          />
        </div>

        {/* Public / Private Toggle Button */}
        <div className="mb-4">
          <Button onClick={togglePublicPrivate} variant="outline">
            {isPublic ? "Make Private" : "Make Public"}
          </Button>
        </div>

        {/* Display Shareable Link if Public */}
        {isPublic && shareableLink && (
          <div className="mb-4">
            <Label>Shareable Link</Label>
            <div className="flex items-center space-x-2">
              <Input id="link" value={shareableLink} readOnly />
              <Button size="sm" className="px-3">
                <Copy />
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


// ShareButton Component


const Page = () => {
  const editorStateRef = useRef(EditorState.createEmpty());
  const [editorState, setEditorState] = useState<any>(editorStateRef.current);
  const [versionHistory, setVersionHistory] = useState<any[]>([]);
  const [permissions, setPermissions] = useState({
    canEdit: true,
    canView: true,
  });
  const [documentTitle, setDocumentTitle] = useState("My Document");

  // Save Document version
  const saveVersion = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    const version = {
      title: documentTitle,
      content: rawContent,
      timestamp: new Date().toISOString(),
    };
    setVersionHistory((prev) => [version, ...prev]);
    alert("Version saved successfully");
  };

  // Toggle permissions
  const togglePermissions = (action: "canEdit" | "canView") => {
    setPermissions((prev) => ({
      ...prev,
      [action]: !prev[action],
    }));
  };

  // Handle text formatting actions
  const handleInlineStyleChange = (style: string) => {
    const currentStyle = editorState.getCurrentInlineStyle();
    let newState = RichUtils.toggleInlineStyle(editorState, style);
    editorStateRef.current = newState;
    setEditorState(newState);
  };

  // Load selected version into the editor
  const handleVersionSelect = (version: any) => {
    const contentState = convertFromRaw(version.content);
    const newState = EditorState.createWithContent(contentState);
    editorStateRef.current = newState;
    setEditorState(newState);
  };

  useEffect(() => {
    editorStateRef.current = editorState;
  }, [editorState]);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>Text Editor</h2>

      {/* Document Title Input */}
      <Input
        value={documentTitle}
        onChange={(e) => setDocumentTitle(e.target.value)}
        placeholder="Enter Document Title"
        style={{ marginBottom: "20px" }}
      />

      <div style={{ marginBottom: "20px" }}>
        <Button onClick={() => togglePermissions("canEdit")}>
          {permissions.canEdit ? "Disable Edit" : "Enable Edit"}
        </Button>
        <Button onClick={() => togglePermissions("canView")}>
          {permissions.canView ? "Disable View" : "Enable View"}
        </Button>
      </div>

      <ShareButton />

      {/* Document Editor */}
      <div
        style={{
          border: "1px solid #ccc",
          backgroundColor: "#f0f0f0",
          minHeight: "300px",
          height: "500px",
          overflowY: "auto",
        }}
      >
        {permissions.canView ? (
          <DynamicEditor
            editorState={editorState}
            onChange={(newEditorState:any) => {
              editorStateRef.current = newEditorState;
              setEditorState(newEditorState);
            }}
            readOnly={!permissions.canEdit}
          />
        ) : (
          <div style={{ textAlign: "center", color: "#ccc", padding: "20px" }}>
            Content is hidden due to view permissions being disabled.
          </div>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <Button onClick={saveVersion}>Save Version</Button>
      </div>

      {/* Version History Dropdown */}
      <div style={{ marginTop: "20px" }}>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button>View Versions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {versionHistory.map((version, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => handleVersionSelect(version)}
              >
                {version.title} - {new Date(version.timestamp).toLocaleString()}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Page;
