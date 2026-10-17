'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — CASE STUDY AUTHORING PAGE
 * Dedicated page hosting CaseStudyEditor with data loading and route handling
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getCMSCaseStudyByIdAction } from '@/server/actions/cms';
import { CaseStudyEditor } from '@/components/admin/cms/case-study-editor';
import type { CMSCaseStudy } from '@/types/admin';

export default function CaseStudyEditorPage() {
  const searchParams = useSearchParams();
  const csId = searchParams.get('id');

  const [caseStudy, setCaseStudy] = useState<CMSCaseStudy | null>(null);
  const [isLoading, setIsLoading] = useState(!!csId);

  useEffect(() => {
    if (!csId) return;

    getCMSCaseStudyByIdAction(csId)
      .then((data) => {
        if (data) setCaseStudy(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load case study', err);
        setIsLoading(false);
      });
  }, [csId]);

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-gray-400 font-mono text-xs space-y-2">
        <i className="fa-solid fa-circle-notch fa-spin text-xl text-[#00f0ff]" />
        <span>Loading case study blueprint...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Link
          href="/admin/cms?tab=case-studies"
          className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-[10px]" />
          <span>Back to Case Studies Portfolio</span>
        </Link>
      </div>

      <CaseStudyEditor initialData={caseStudy} />
    </div>
  );
}
