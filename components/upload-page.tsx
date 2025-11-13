"use client";

import { RiOpenaiFill, RiAnthropicFill, RiGoogleFill,  } from "react-icons/ri";
import { motion, type Variants } from "framer-motion";

import { Terminal } from "@/components/ui/terminal";
import Card08 from "@/components/kokonutui-pro/card-08";
import FileUpload  from "@/components/kokonutui/file-upload";

interface Statistic {
    value: string;
    label: string;
    description: string;
    index: string;
}

const statistics: Statistic[] = [
    {
        value: "100+",
        label: "Enterprise solutions delivered",
        description:
            "Powering mission-critical applications for Fortune 500 companies with cutting-edge technology.",
        index: "01",
    },
    {
        value: "99.9%",
        label: "System uptime achieved",
        description:
            "Our robust infrastructure and proactive monitoring ensure your systems run without interruption.",
        index: "02",
    },
];

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
};

export default function Feature06() {
    return (
            <section className="relative pb-24 sm:pb-32 bg-white dark:bg-black overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top Section with Badge */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="flex flex-col items-start gap-4 mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900">
                        <span className="flex h-2 w-2 rounded-full bg-neutral-900 dark:bg-neutral-100" />
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            Let's help you upload
                        </span>
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Left Column */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="space-y-8"
                    >
                        <motion.h2
                            variants={fadeInUp}
                            className="text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
                        >
                            Upload your documents,{" "}
                            <span className="text-neutral-900 dark:text-neutral-400">
                               and choose your AI model. 
                            <br />
                            <span className="text-4xl sm:text-2xl font-semibold tracking-tight text-neutral-400 dark:text-neutral-100"
                            >
                            Review your results and make changes as needed.
                            </span>
                            </span>
                        </motion.h2>

                        
                    </motion.div>

                    {/* Right Column - Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="relative  overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900"
                    >
                        <FileUpload />
                        <div className="absolute inset-0 pointer-events-none border border-neutral-200 dark:border-neutral-800 rounded-2xl" />
                    </motion.div>
                </div>                {/* Statistics Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid sm:grid-cols-2 gap-8 mt-24"
                >
                                    <Terminal children={<div>Processing your documents...</div>} />
                                    <Card08 />
                </motion.div>
            </div>
        </section>
    );
}
