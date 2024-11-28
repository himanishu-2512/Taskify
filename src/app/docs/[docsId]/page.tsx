"use client";
import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { EditorState, RichUtils, convertFromRaw, convertToRaw } from "draft-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CiShare2 } from "react-icons/ci";
import { useParams } from "next/navigation";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoMdSave } from "react-icons/io";

import { FaHistory } from "react-icons/fa";
import { getRequest, postRequest } from "@/utils/apiUtils";
import { API_ENDPOINTS } from "@/constants/apiEndPointsConstant";
import { setIsLoading } from "@/redux/authSlice";
import { useDispatch } from "react-redux";

// Dynamically load the Draft.js Editor component
const DynamicEditor = dynamic(
  () => import("draft-js").then((mod) => mod.Editor),
  { ssr: false }
);

// ShareButton Component
const ShareButton = ({ access }) => {
  const dispatch = useDispatch();
  const [token, setToken] = useState("");
  const { docsId } = useParams();
  const [permission, setPermission] = useState<
    "can edit" | "can read" | "no access"
  >("can edit");
  const [email, setEmail] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(access); // New state for public/private
  const [shareableLink, setShareableLink] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedValue = localStorage.getItem("accessToken");
      setToken(storedValue);
    }
  }, []);

  useEffect(() => {
    setIsPublic(access);
    if (!isPublic) {
      // Generate a unique link when the document is public
      const generatedLink = `http://localhost:3000/docs/${docsId}`;
      setShareableLink(generatedLink);
    }
  }, [access]);
  // Handle permission change
  const handlePermissionChange = (
    newPermission: "can edit" | "can view" | "no access"
  ) => {
    setPermission(newPermission);
  };
  const addPermission = async () => {
    dispatch(setIsLoading());
    try {
      const response = await postRequest(
        API_ENDPOINTS.DOCUMENT.ADD_PERMISSIONS(docsId),
        {},
        {},
        { targetUserEmail: email, accessLevel: permission },
        token
      );
      if (response?.data?.message) {
        alert(response.data.message);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        alert(error?.response?.data?.message);
      }
    } finally {
      dispatch(setIsLoading());
    }
  };

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Handle toggling of public/private mode
  const togglePublicPrivate = async () => {
    try {
      const response = await postRequest(
        API_ENDPOINTS.DOCUMENT.CHANGE_VISIBILITY(docsId),
        {},
        {},
        { visibility: isPublic ? "private" : "public" },
        token
      );
      if (response?.data?.message) {
        alert(response?.data?.message);
        setIsPublic((prev) => !prev);
        if (!isPublic) {
          // Generate a unique link when the document is public
          const generatedLink = `http://localhost:3000/docs/${docsId}`;
          setShareableLink(generatedLink);
        } else {
          setShareableLink(""); // Clear link if set to private
        }
      }
    } catch (error) {
      alert(error?.response?.data?.message);
    }
  };
  const [copySuccess, setCopySuccess] = useState(false);

  // Function to handle copying the shareable link to the clipboard
  const handleCopyClick = async () => {
    if (shareableLink) {
      try {
        await navigator.clipboard.writeText(shareableLink); // Clipboard API for copying text
        setCopySuccess(true); // Show success feedback
        setTimeout(() => setCopySuccess(false), 2000); // Reset success message after 2 seconds
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">
          Share
          <CiShare2 />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md backdrop:blur-md">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
        </DialogHeader>

        {/* Permission Dropdown */}
        <div className="mb-4">
          <Label>Permission Type</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="ml-[10px]">
              <Button variant="tertiary">
                {permission === "can edit"
                  ? "can edit"
                  : permission === "can read"
                  ? "can read"
                  : "no access"}
                <RiArrowDropDownLine />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => handlePermissionChange("can edit")}
              >
                Can Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handlePermissionChange("can read")}
              >
                Can Read
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handlePermissionChange("no access")}
              >
                Revoke access
              </DropdownMenuItem>
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
              <Button size="sm" className="px-3" onClick={handleCopyClick}>
                <Copy />
                {copySuccess ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="primary"
            onClick={() => addPermission()}
          >
            Add Permission
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ShareButton Component

const Page = () => {
  const { docsId } = useParams();
  const dispatch = useDispatch();
  const editorStateRef = useRef(EditorState.createEmpty());
  const [access, setAccess] = useState<boolean>(false);
  const [editorState, setEditorState] = useState<any>(editorStateRef.current);
  const [versionHistory, setVersionHistory] = useState<any[]>([]);
  const [permissions, setPermissions] = useState({
    canEdit: true,
    canView: true,
  });
  const [documentDescription, setDocumentDescription] = useState("");
  const [documentTitle, setDocumentTitle] = useState("My Document");
  const [token, setToken] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedValue = localStorage.getItem("accessToken");
      setToken(storedValue);
    }
  }, []);

  const handleVersionSelect = (version: any) => {
    if (version) {
      console.log("Raw Content Before Fixing:", version.latestContent);

      try {
        // Fix the raw content format
        const fixedContent = {
          blocks: Object.values(version.blockMap).map((block: any) => ({
            key: block.key,
            type: block.type,
            text: block.text,
            depth: block.depth,
            inlineStyleRanges: block.characterList.map(
              (char: any, index: number) => ({
                offset: index,
                length: 1,
                style: char.style.join(" "),
              })
            ),
            entityRanges: block.characterList
              .filter((char: any) => char.entity !== null)
              .map((char: any, index: number) => ({
                offset: index,
                length: 1,
                key: char.entity,
              })),
            data: {},
          })),
          entityMap: {},
        };

        // Now convert the raw content state
        const contentState = convertFromRaw(fixedContent);
        const newState = EditorState.createWithContent(contentState);

        editorStateRef.current = newState;
        setEditorState(newState);
      } catch (error) {
        console.error("Error converting raw content:", error);
      }
    } else {
      console.error("Invalid version or latestContent:", version);
    }
  };

  const fetchDocumentDeatil = async () => {
    dispatch(setIsLoading());
    try {
      const response = await getRequest(
        API_ENDPOINTS.DOCUMENT.GET_DETAIL(docsId),
        {},
        {},
        token
      );
      console.log(response);
      setDocumentTitle(response?.data?.document?.title);
      setDocumentDescription(response?.data?.document?.description);
      if (
        response?.data?.document?.latestContent &&
        response?.data?.document?.latestContent != ""
      ) {
        handleVersionSelect(response?.data?.document?.latestContent);
        setVersionHistory(response?.data?.document?.versions);
        setAccess(response?.data?.document?.access === "public");
      }
    } catch (error) {
      alert(error?.response?.data?.message);
    } finally {
      dispatch(setIsLoading());
    }
  };

  const fetchDocumentVersions = async () => {
    try {
      const response = await getRequest(
        API_ENDPOINTS.DOCUMENT.GET_LAST_TEN_VERSIONS(docsId),
        {},
        {},
        token
      );
      setVersionHistory(response.data.versions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token && token != "") {
      fetchDocumentDeatil();
    }
  }, [docsId, token]);

  useEffect(() => {
    console.log(versionHistory);
  }, [versionHistory]);

  // Save Document version
  const saveVersion = async () => {
    dispatch(setIsLoading());
    try {
      const contentState = editorState.getCurrentContent();
      const rawContent = convertToRaw(contentState);
      const version = {
        content: contentState,
      };
      const data = {
        title: documentTitle,
        description: documentDescription,
        content: contentState,
      };
      const response = await postRequest(
        API_ENDPOINTS.DOCUMENT.UPDATE_DOCUMENT(docsId),
        {},
        {},
        data,
        token
      );
      setVersionHistory(response.data.document.versions);
      alert("Version saved successfully");
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      dispatch(setIsLoading());
    }
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

  useEffect(() => {
    editorStateRef.current = editorState;
  }, [editorState]);

  return (
    <div
      style={{
        padding: "20px",
        minWidth: "800px",
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      <h2 className="font-bold text-[20px]">Text Editor</h2>

      {/* Document Title Input */}
      <Input
        value={documentTitle}
        className="bg-neutral-200"
        onChange={(e) => setDocumentTitle(e.target.value)}
        placeholder="Enter Document Title"
        style={{ marginBottom: "20px" }}
      />
      <Input
        value={documentDescription}
        className="bg-neutral-200 shadow-md"
        onChange={(e) => setDocumentDescription(e.target.value)}
        placeholder="Enter Document Description"
        style={{ marginBottom: "20px" }}
      />

      <div className="flex w-[100%] mb-[20px] justify-between items-center">
        <div className="flex gap-[20px] justify-center items-center">
          <div style={{ marginTop: "20px" }}>
            <Button onClick={saveVersion}>
              <IoMdSave /> Save Version
            </Button>
          </div>

          {/* Version History Dropdown */}
          <div style={{ marginTop: "20px" }}>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="bg-blue-600 text-white font-semibold rounded-md px-[10px] py-[8px] flex justify-center items-center"
                onClick={() => fetchDocumentVersions()}
              >
                <FaHistory className="mr-[10px]" /> View Versions
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {versionHistory.map((version, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => handleVersionSelect(version.content)}
                  >
                    {version.versionNumber}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-[20px]">
          <ShareButton access={access} />
        </div>
      </div>
      {/* <div style={{ marginBottom: "20px" }}>
        <Button onClick={() => togglePermissions("canEdit")}>
          {permissions.canEdit ? "Disable Edit" : "Enable Edit"}
        </Button>
        <Button onClick={() => togglePermissions("canView")}>
          {permissions.canView ? "Disable View" : "Enable View"}
        </Button>
      </div> */}

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
            onChange={(newEditorState: any) => {
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
    </div>
  );
};

export default Page;
