"use client";
import { FormEvent, SyntheticEvent, useState } from "react";
import { Spotlight } from "./ui/Spotlight";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import useUrlAnalysis from "@/hooks/useUrlAnalysis";
import MagicButton from "./MagicButton";
import { FaShieldAlt } from "react-icons/fa";
import { MultiStepLoader } from "./Loader";
import { Analysis } from "./Analysis";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { RiFileUploadFill } from "react-icons/ri";
import toast from "react-hot-toast";
import { a11yProps, CustomTabPanel } from "./MUI";
import { isValidImageFile } from "@/helpers/fileUtils";
import { extractUrl, formatUrl, trimUrl } from "@/helpers/urlUtils";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00ED82",
    },
    mode: "dark",
  },
});

const Hero = () => {
  const [url, setUrl] = useState<string>("");
  const { analyzeUrl, analysisData, loading } = useUrlAnalysis();
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [formattedLink, setFormattedLink] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Trim the URL to its base domain using the helper function
    const trimmedUrl = trimUrl(url.trim());

    setFormattedLink(trimmedUrl);
    analyzeUrl(trimmedUrl);
    setUrl("");
  };

  // TABS
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessingFile(true);

    // Create FormData
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Send the file to the API
      const response = await fetch("/api/proxy/ocr", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.error;
        throw Error(errorMessage);
      }

      const { parsedText } = await response.json();

      // Extract the URL from the text
      const link = extractUrl(parsedText);

      if (!link) {
        throw new Error("No valid URL found in the extracted text.");
      }

      // Format the link
      const formattedLink = formatUrl(link);

      console.log(formattedLink);

      // Set the formatted link in the state and analyze
      setFormattedLink(formattedLink);
      analyzeUrl(formattedLink);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessingFile(false);
    }
  };

  // CHOOSING FILE
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      toast.error("No file selected.");
      return;
    }

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!isValidImageFile(file)) {
        toast.error(
          "Unsupported file format. Please drop a valid image file (JPG, PNG, or WEBP)."
        );
        return;
      }

      handleFileUpload(file);
    }
  };

  // DRAG & DROP FILE
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) {
      toast.error("No file dropped.");
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];

      if (!isValidImageFile(file)) {
        toast.error(
          "Unsupported file format. Please drop a valid image file (JPG, PNG, or WEBP)."
        );
        return;
      }

      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="pb-32 pt-4 md:pt-16 lg:pt-4 xl:pt-14 ">
      {/**
       *  UI: Spotlights
       *  Link: https://ui.aceternity.com/components/spotlight
       */}
      <div>
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="white"
        />
        <Spotlight className="h-[80vh] w-[50vw] top-10 left-full" fill="blue" />
        <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" />
      </div>

      {/**
       *  UI: grid
       *  change bg color to bg-black-100 and reduce grid color from
       *  0.2 to 0.03
       */}
      <div
        className="h-screen w-full dark:bg-black-100 bg-white dark:bg-grid-white/[0.03] bg-grid-black-100/[0.2]
       absolute top-0 left-0 flex items-center justify-center"
      >
        {/* Radial gradient for the container to give a faded look */}
        <div
          // change the bg to bg-black-100, so it matches the bg color and will blend in
          className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100
         bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        />
      </div>

      <div className="flex justify-center relative my-10 lg:my-20 z-10 ">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[80vw] xl:max-w-[70vw] 2xl:max-w-[60vw] flex flex-col items-center justify-center">
          <p className="uppercase tracking-widest text-xs text-center text-blue-100 max-w-80">
            Protecting You from Phishing Threats
          </p>

          {/**
           *  Link: https://ui.aceternity.com/components/text-generate-effect
           *
           *  change md:text-6xl, add more responsive code
           */}
          <TextGenerateEffect
            words="Intercept and Block Malicious URLs"
            className="text-center text-[40px] md:text-5xl lg:text-7xl "
          />

          <p className="text-center md:tracking-wider mt-3 mb-6 text-base md:text-lg lg:text-xl ">
            Welcome to <span className="text-[#00ED82]">URL-Fortify</span> ,
            your advanced tool for safeguarding against <br /> phishing and
            malicious links.
          </p>

          <ThemeProvider theme={theme}>
            <Box
              sx={{ width: "100%" }}
              className="flex items-center justify-center flex-col  "
            >
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="URL" {...a11yProps(0)} />
                  <Tab label="Image" {...a11yProps(1)} />
                </Tabs>
              </Box>
              {/* URL */}
              <CustomTabPanel className="w-full" value={value} index={0}>
                <div className="w-full md:w-[90%] lg:w-[80%] mx-auto lg:mt-4">
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col md:flex-row items-center gap-2  "
                  >
                    <div className="lg:basis-[80%] md:basis-[70%] w-full">
                      <input
                        className="bg-slate-950 px-4 border border-green-400 w-full h-12 md:rounded-tl-lg md:rounded-bl-lg rounded-lg lg:rounded-br-none lg:rounded-tr-none"
                        type="text"
                        placeholder="Enter your URL here"
                        value={url}
                        onChange={(e) => {
                          setUrl(e.target.value);
                        }}
                        aria-label="url input"
                      />
                    </div>
                    <div className="lg:basis-[20%] md:basis-[30%] basis-full w-full mt-2 md:mt-0 ">
                      <MagicButton
                        title={loading ? "Analyzing..." : "Analyze"}
                        icon={loading ? null : <FaShieldAlt fontSize={18} />}
                        position="left"
                        disabled={loading}
                      />
                    </div>
                  </form>
                  <p className="mt-4 text-sm text-gray-400 text-center lg:w-1/2 mx-auto">
                    Paste a URL into the input field above, and
                    &apos;Analyze&apos; to get started and identify potential
                    phishing threats.
                  </p>
                </div>
              </CustomTabPanel>

              {/* Image Upload */}
              <CustomTabPanel
                value={value}
                index={1}
                className="max-w-[400px] 2xl:max-w-[450px]"
              >
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="w-full p-6 border border-green-400 text-center rounded-lg "
                  style={{
                    background: "rgb(4,7,29)",
                    backgroundColor:
                      "linear-gradient(90deg, rgba(3, 59, 43, 1) 0%, rgba(0, 237, 130, 1) 100%)",
                  }}
                >
                  <p className="mb-4 text-sm  text-gray-400">
                    Drag and drop a file here, or choose a file.
                  </p>
                  <input
                    type="file"
                    id="fileUpload"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <MagicButton
                    title={
                      loading || isProcessingFile
                        ? "Analyzing file..."
                        : "Choose File"
                    }
                    icon={<RiFileUploadFill fontSize={18} />}
                    position="left"
                    htmlFor="fileUpload"
                    disabled={loading || isProcessingFile}
                  />
                </div>
                <p className="text-sm mt-4 text-center text-gray-400">
                  Upload an image, and our optical character recognition (OCR)
                  technology will extract any URLs it contains. Simply drag and
                  drop the file or use the &apos;Choose File&apos; button to get
                  started and identify potential phishing threats.
                </p>
              </CustomTabPanel>
            </Box>
          </ThemeProvider>

          {loading && <MultiStepLoader loading={loading} />}

          {analysisData && (
            <Analysis
              url={formattedLink}
              screenshot={analysisData?.screenshot}
              categories={analysisData?.categories || []}
              lastAnalysisStats={analysisData?.lastAnalysisStats || {}}
              lastAnalysisResults={analysisData?.lastAnalysisResults || {}}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
