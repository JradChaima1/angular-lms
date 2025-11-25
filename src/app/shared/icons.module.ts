import { NgModule } from '@angular/core';
import { LucideAngularModule, Home, BookOpen, Trophy, Settings, LogOut, User, Mail, Lock, ArrowLeft, Play, CheckCircle, Clock, Users, Star, Award, Search, Filter, ChevronRight, Menu, X, Bell, Calendar, MessageSquare, BarChart3, FileText, Video, Download, Upload, Edit, Trash2, Plus, Calculator, Book, Palette, Music, Info, AlertTriangle } from 'lucide-angular';

@NgModule({
  imports: [
    LucideAngularModule.pick({
      Home,
      BookOpen,
      Trophy,
      Settings,
      LogOut,
      User,
      Mail,
      Lock,
      ArrowLeft,
      Play,
      CheckCircle,
      Clock,
      Users,
      Star,
      Award,
      Search,
      Filter,
      ChevronRight,
      Menu,
      X,
      Bell,
      Calendar,
      MessageSquare,
      BarChart3,
      FileText,
      Video,
      Download,
      Upload,
      Edit,
      Trash2,
      Plus,
      Calculator,
      Book,
      Palette,
      Music,
      Info,
      AlertTriangle
    })
  ],
  exports: [LucideAngularModule]
})
export class IconsModule {}
